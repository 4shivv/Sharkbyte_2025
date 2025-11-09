import express from 'express';
import { getScanResult } from '../controllers/scanController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All scan routes require authentication
router.use(authMiddleware);

// GET /api/scans/:scanId - Get scan result by ID
router.get('/:scanId', getScanResult);

export default router;
