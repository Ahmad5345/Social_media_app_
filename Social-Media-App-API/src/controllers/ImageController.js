import multer from 'multer';
import Image from '../models/image.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('upload multer: Only image files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

export const uploadImage = upload.single('image');

export const saveImageToDB = async (req, res) => {
  try {
    if (!req.file) {
      console.log('saveImageToDB error: No file uploaded');
      return res.status(400).json({ error: 'saveImageToDB error: No file uploaded' });
    }

    const image = new Image({
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await image.save();

    return res.status(201).json({
      message: 'Image uploaded sucessfully',
      imageId: image._id,
    });
  } catch (error) {
    console.log(`saveImageToDB error: ${error.message}`);
    return res.status(500).json({ error: `saveImageToDB error: ${error.message}` });
  }
};

export const getImageFromDB = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', image.image.contentType);
    return res.send(image.image.data); // now a true Buffer
  } catch (error) {
    console.error('getImageFromDB error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteImageFromDB = async (req, res) => {
  try {
    const deleted = await Image.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'deleteImageFromDB: Image not found' });
    }
    return res.status(200).json({ message: 'deleteImageFromDB: Image sucessfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: `deleteImageFromDB error: ${error.message}` });
  }
};
