import { Router } from 'express';
import * as Controllers from '../controllers/UserController.js';
import { requireSignin } from '../services/passport.js';

const router = Router();

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = Controllers.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await Controllers.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
