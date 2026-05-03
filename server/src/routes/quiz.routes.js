import { Router } from 'express';
import { getQuiz, submitQuiz, getQuizHistory } from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/history', authenticate, getQuizHistory);
router.get('/:id', authenticate, getQuiz);
router.post('/:id/submit', authenticate, submitQuiz);

export default router;
