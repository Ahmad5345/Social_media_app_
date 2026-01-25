import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const User = new Schema(
  {
    // eslint-disable-next-line object-curly-newline
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

User.pre('save', async function beforeUserSave() {
  const user = this;

  if (!user.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    throw new Error(`Error User.pre ${error}`);
  }
});

User.methods.comparePassword = async function comparePassword(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const UserModel = mongoose.model('User', User);
export default UserModel;
