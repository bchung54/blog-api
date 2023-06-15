import { isValidObjectId } from 'mongoose';

function validateObjectId(req, res, next) {
  const commentId = req.params.commentid ? req.params.commentid : '';
  const postId = req.params.postid ? req.params.postid : '';

  if (commentId && !isValidObjectId(commentId)) {
    return res
      .status(404)
      .json({ message: 'Invalid URL: comment ObjectId invalid.' });
  }

  if (postId && !isValidObjectId(postId)) {
    return res
      .status(404)
      .json({ message: 'Invalid URL: post ObjectId invalid.' });
  }

  next();
}

export default validateObjectId;
