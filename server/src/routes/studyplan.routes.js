import { Router } from 'express';
import { getStudyPlans, getStudyPlanById, updateStudyPlanStatus } from '../controllers/studyplan.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getStudyPlans);
router.get('/:id', authenticate, getStudyPlanById);
router.put('/:id/status', authenticate, updateStudyPlanStatus);

export default router;
