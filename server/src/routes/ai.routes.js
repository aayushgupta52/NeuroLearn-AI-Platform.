import { Router } from 'express';
import { chat, generateQuiz, generateStudyPlan, getChatSessions, getChatMessages, generateVideoRecommendations } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/chat', authenticate, chat);
router.post('/generate-quiz', authenticate, generateQuiz);
router.post('/study-plan', authenticate, generateStudyPlan);
router.post('/suggest-videos', authenticate, generateVideoRecommendations);
router.get('/sessions', authenticate, getChatSessions);
router.get('/sessions/:sessionId/messages', authenticate, getChatMessages);

export default router;
