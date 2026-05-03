import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getAchievements, getLeaderboard } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);
router.get('/achievements', authenticate, getAchievements);
router.get('/leaderboard', getLeaderboard);

export default router;
