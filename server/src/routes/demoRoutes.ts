import { Router } from 'express';
import { runDemoScenario } from '../controllers/demoController.js';

const router = Router();

// Demo scenarios do not require authorization, ensuring instant evaluation during live presentation
router.get('/:scenarioId', runDemoScenario);

export default router;

