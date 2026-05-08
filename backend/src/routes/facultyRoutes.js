import express from 'express';
import { getPendingEvents, approveEvent, rejectEvent } from '../controllers/facultyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes here are protected and only for 'faculty' role
router.use(protect);
router.use(authorizeRoles('faculty'));

router.get('/pending-events', getPendingEvents);
router.put('/:id/approve', approveEvent);
router.put('/:id/reject', rejectEvent);

export default router;
