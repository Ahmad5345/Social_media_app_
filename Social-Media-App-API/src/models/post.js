import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image: { type: Schema.Types.ObjectId, ref: 'Image', default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: 0 }],
    comments: [CommentSchema],
  },
  { timestamps: true },
);

export default mongoose.model('Post', PostSchema);
