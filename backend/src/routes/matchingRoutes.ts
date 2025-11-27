import { Router } from 'express';
import { MatchingController } from '../controllers/matchingController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload, handleMulterError } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * Debug endpoint - Test text extraction (no auth)
 * POST /api/matching/debug-extract
 */
router.post(
  '/debug-extract',
  upload.fields([
    { name: 'resume', maxCount: 1 },
  ]),
  handleMulterError,
  MatchingController.debugExtraction
);

/**
 * Compare resume with job description (no auth required)
 * POST /api/matching/compare
 */
router.post(
  '/compare',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescription', maxCount: 1 },
  ]),
  handleMulterError,
  MatchingController.compareResumeWithJD
);

/**
 * Protected Routes - Require Authentication
 */

/**
 * Get match history for user
 * GET /api/matching/history
 */
router.get('/history', authMiddleware, MatchingController.getMatchHistory);

export default router;
