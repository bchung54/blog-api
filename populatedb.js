#! /usr/bin/env node

import mongoose from 'mongoose';
import { default as User } from './models/user.js';
import { default as Post } from './models/post.js';
import { default as Comment } from './models/comment.js';

console.log(
  'This script populates database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/blog-api?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

const users = [];
const posts = [];
const comments = [];

mongoose.set('strictQuery', false);

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');

  await createUsers();
  await createPosts();
  await createComments();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function userCreate(name, username, email, password) {
  const user = new User({
    name: name,
    username: username,
    email: email,
    password: password,
  });

  await user.save();
  users.push(user);
  console.log(`Added user: ${username}`);
}

async function postCreate(
  title,
  authorId,
  content,
  createdAt,
  published = false
) {
  const postdetail = {
    title: title,
    authorId: authorId,
    content: content,
  };
  if (published !== false) postdetail.published = published;

  const post = new Post(postdetail);

  await post.save();
  posts.push(post);
  console.log(`Added post: ${title} by ${authorId} at ${post.createdAt}`);
}

async function commentCreate(postId, author, email, content) {
  const comment = new Comment({
    postId: postId,
    author: author,
    email: email,
    content: content,
  });

  await comment.save();
  comments.push(comment);
  console.log(`Added comment: ${content} by ${author}`);
}

async function createUsers() {
  console.log('Adding users...');
  await Promise.all([
    userCreate('admin', 'admin', 'admin@blog.com', 'adminkey'),
    userCreate('blogger', 'blogger', 'blogger@blog.com', 'bloggerkey'),
    userCreate('John Donne', 'johndonne', 'jd@blog.com', 'johndonnekey'),
  ]);
}

async function createPosts() {
  console.log('Adding posts...');
  await Promise.all([
    postCreate(
      'No Man is an Island',
      users[2],
      'No man is an island entire of itself; every man',
      true
    ),
    postCreate('Hello World', users[0], 'Obligatory hello world post', true),
    postCreate('Bye Bye Blog', users[0], 'Unfinished, not to be published'),
  ]);
}

async function createComments() {
  console.log('Adding comments...');
  await Promise.all([
    commentCreate(posts[0], 'Sean', 'sean@sean.com', 'So true'),
    commentCreate(posts[0], 'Kate', 'kate@kate.com', 'This hits home'),
    commentCreate(posts[1], 'Madison', 'madison@madison.com', 'Hello there'),
  ]);
}
