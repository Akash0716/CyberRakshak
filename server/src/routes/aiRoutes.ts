import { Router } from 'express';
import { analyzeContent, getSampleScenarios } from '../controllers/aiController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/analyze', authenticateJWT, analyzeContent);
router.get('/scenarios', authenticateJWT, getSampleScenarios);

export default router;

