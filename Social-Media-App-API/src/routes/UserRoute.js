import { Router } from 'express';
import * as Controllers from '../controllers/UserController.js';
import { requireSignin } from '../services/passport.js';

const router = Router();

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = Controllers.signin(req.user);
    res.json({ token, user: { _id: req.user._id, email: req.user.email } });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const user = await Controllers.signup(req.body);
    res.json({ token: user.token, user: { _id: user.user._id, email: user.user.email } });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
