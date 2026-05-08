import express from 'express';
import { getAllEvents, approveEvent, rejectEvent, getClubs, toggleClubStatus } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes here are protected and only for 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/events', getAllEvents);
router.put('/:id/approve', approveEvent);
router.put('/:id/reject', rejectEvent);
router.get('/clubs', getClubs);
router.put('/clubs/:id/toggle-status', toggleClubStatus);

export default router;
