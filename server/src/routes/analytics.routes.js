import { Router } from 'express';
import { getOverview, getPerformance, getWeakAreas } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/overview', authenticate, getOverview);
router.get('/performance', authenticate, getPerformance);
router.get('/weak-areas', authenticate, getWeakAreas);

export default router;
