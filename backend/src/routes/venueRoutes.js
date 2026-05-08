import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getVenues, createVenue, updateVenue, deleteVenue } from '../controllers/venueController.js';

const router = express.Router();

router.get('/', protect, getVenues);
router.post('/', protect, authorizeRoles('admin'), createVenue);
router.put('/:id', protect, authorizeRoles('admin'), updateVenue);
router.delete('/:id', protect, authorizeRoles('admin'), deleteVenue);

export default router;
