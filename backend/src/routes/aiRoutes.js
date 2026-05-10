import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { chatWithJarvis } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', protect, chatWithJarvis);

export default router;
