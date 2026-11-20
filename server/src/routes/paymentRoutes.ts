import { Router } from 'express';
import { getPaymentRecords, verifyPayment, createPaymentRecord } from '../controllers/paymentController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Verification is open to authenticated users (and can be called by students)
router.post('/verify', authenticateJWT, verifyPayment);
router.get('/records', authenticateJWT, getPaymentRecords);

// Administrator adds approved campus payment channels
router.post('/records', authenticateJWT, authorizeRoles('administrator'), createPaymentRecord);

export default router;

