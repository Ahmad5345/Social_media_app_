import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/UserAuth.js';

dotenv.config();

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode(
    {
      sub: user.id,
      iat: timeStamp,
    },
    process.env.AUTH_SECRET,
  );
}

export const signin = (user) => {
  return tokenForUser(user);
};

export const signup = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email or Password was not provided');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is in Use');
  }

  const user = new User({ email, password });
  await user.save();

  return { token: tokenForUser(user), user };
};
