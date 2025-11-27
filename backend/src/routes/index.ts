import { Router } from 'express';
import authRoutes from './authRoutes';
import matchingRoutes from './matchingRoutes';
import jobRoutes from './jobRoutes';

const router = Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/matching', matchingRoutes);
router.use('/jobs', jobRoutes);

export default router;
