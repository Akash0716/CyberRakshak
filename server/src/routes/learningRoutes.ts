import { Router } from 'express';
import { getLessons, submitQuizScore, getUserProgress } from '../controllers/learningController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/lessons', authenticateJWT, getLessons);
router.post('/quiz', authenticateJWT, submitQuizScore);
router.get('/progress', authenticateJWT, getUserProgress);

export default router;

