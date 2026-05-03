import { Router } from 'express';
import { getCourses, getCourseById, createCourse, enrollInCourse, getMyEnrollments } from '../controllers/course.controller.js';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getCourses);
router.get('/enrolled', authenticate, getMyEnrollments);
router.get('/:id', optionalAuth, getCourseById);
router.post('/', authenticate, requireRole('ADMIN'), createCourse);
router.post('/:id/enroll', authenticate, enrollInCourse);

export default router;
