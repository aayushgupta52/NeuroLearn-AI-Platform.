import { Router } from 'express';
import { getLesson, completeLesson, getLessonsByModule } from '../controllers/lesson.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/module/:moduleId', optionalAuth, getLessonsByModule);
router.get('/:id', optionalAuth, getLesson);
router.post('/:id/complete', authenticate, completeLesson);

export default router;
