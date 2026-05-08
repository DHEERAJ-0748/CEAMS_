import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/', protect, getCalendarEvents);
router.post('/', protect, authorizeRoles('admin', 'faculty'), createCalendarEvent);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCalendarEvent);

export default router;
