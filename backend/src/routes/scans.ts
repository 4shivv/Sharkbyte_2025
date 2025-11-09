import express from 'express';
import { getScanResult, remediatePrompt } from '../controllers/scanController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All scan routes require authentication
router.use(authMiddleware);

// GET /api/scans/:scanId - Get scan result by ID
router.get('/:scanId', getScanResult);

// POST /api/scans/:scanId/remediate - Generate hardened prompt (FR-4.7)
router.post('/:scanId/remediate', remediatePrompt);

export default router;
