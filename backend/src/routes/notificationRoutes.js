import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getNotifications, markAsRead, createNotification, getSentNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/sent', protect, authorizeRoles('admin', 'principal'), getSentNotifications);
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/', protect, authorizeRoles('admin', 'principal'), createNotification);

export default router;
