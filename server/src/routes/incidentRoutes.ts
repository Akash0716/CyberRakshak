import { Router } from 'express';
import { submitIncident, getIncidents, updateIncidentStatus } from '../controllers/incidentController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateJWT, submitIncident);
router.get('/', authenticateJWT, getIncidents);
router.patch('/:id/status', authenticateJWT, authorizeRoles('administrator'), updateIncidentStatus);

export default router;

