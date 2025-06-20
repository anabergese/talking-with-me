import express from 'express';
import multer from 'multer';
import { handleAudioUpload } from '../controllers/audioController.js';

const router = express.Router();

// Configura multer aquí si solo se usa en estas rutas
const storage = multer.diskStorage({
  destination: './',
  filename: (req, file, cb) => cb(null, 'audio.mp3'),
});
const upload = multer({ storage });

router.post('/upload', upload.single('audio'), handleAudioUpload);

export default router;
