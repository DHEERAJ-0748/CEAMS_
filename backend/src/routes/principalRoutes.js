import express from 'express';
import { 
  getStats, 
  getEvents, 
  approveEvent, 
  rejectEvent, 
  requestClarification,
  getBudgetAnalytics
} from '../controllers/principalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('principal'));

router.get('/stats', getStats);
router.get('/events', getEvents);
router.put('/:id/approve', approveEvent);
router.put('/:id/reject', rejectEvent);
router.put('/:id/clarify', requestClarification);
router.get('/budget-analytics', getBudgetAnalytics);

export default router;
