import express from 'express';
import { createEvent, getMyEvents } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes here are protected and only for 'club' role
router.use(protect);
router.use(authorizeRoles('club'));

router.post('/create', createEvent);
router.get('/my-events', getMyEvents);

export default router;
