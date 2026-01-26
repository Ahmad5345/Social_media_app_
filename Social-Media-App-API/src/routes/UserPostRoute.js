import { Router } from 'express';
import Post from '../models/post.js';
import { requireAuth } from '../services/passport.js';

const router = Router();

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate('author', 'email')
      .populate('comments.user', 'email')
      .populate('image', '_id')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: `getUserPosts: ${error.message}` });
  }
});

export default router;