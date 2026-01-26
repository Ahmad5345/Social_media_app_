import { Router } from 'express';
import * as Controllers from '../controllers/PeopleProfileController.js';
import { requireAuth } from '../services/passport.js';

const router = Router();

router.post('/new', requireAuth, async (req, res, next) => {
  try {
    const profile = req.body;
    const result = await Controllers.setProfile(req.user._id, profile);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const result = await Controllers.getProfile(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', requireAuth, async (req, res, next) => {
  try {
    const result = await Controllers.getProfile(req.params.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/visibility', requireAuth, async (req, res, next) => {
  try {
    const { visibility } = req.body;
    const result = await Controllers.updateProfileVisibility(req.user._id, visibility);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', requireAuth, async (req, res, next) => {
  try {
    const result = await Controllers.getProfile(req.params.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
