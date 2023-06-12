import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: String, required: true, maxLength: 99 },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

CommentSchema.virtual('url').get(function () {
  return `/comments/${this._id}`;
});

export default mongoose.model('Comment', CommentSchema);
