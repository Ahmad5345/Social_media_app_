import { Router } from 'express';
import profile from './PeopleProfileRoute.js';
import Auth from './UserRoute.js';
import imageRoutes from './ImageRoutes.js';
import postRoutes from './PostRoute.js';
import userPostRoutes from './UserPostRoute.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to API!' });
});

router.use('/profile', profile);
router.use('/auth', Auth);
router.use('/images', imageRoutes);
router.use('/posts', postRoutes);
router.use('/user-posts', userPostRoutes);

export default router;
