import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    image: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export default mongoose.model('Image', imageSchema);
