import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 64 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    published: { type: Boolean },
  },
  { timestamps: true }
);

PostSchema.virtual('url').get(function () {
  return `/posts/${this._id}`;
});

export default mongoose.model('Post', PostSchema);
