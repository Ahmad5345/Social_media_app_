import { Router } from 'express';
import {
  uploadImage,
  saveImageToDB,
  getImageFromDB,
  deleteImageFromDB,
} from '../controllers/ImageController.js';

const router = Router();

router.post('/', uploadImage, saveImageToDB);
router.get('/:id', getImageFromDB);
router.delete('/:id', deleteImageFromDB);

export default router;
