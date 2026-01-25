import { Router } from 'express';
import {
  createPost,
  getFeed,
  toggleLike,
  addComment,
} from '../controllers/postController.js';
import { requireAuth } from '../services/passport.js';

const router = Router();

router.post('/', requireAuth, createPost);
router.get('/', requireAuth, getFeed);
router.post('/postId/like', requireAuth, toggleLike);
router.post('/postId/comment', requireAuth, addComment);

export default router;
