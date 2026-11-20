import { Router } from 'express';
import { 
  getNotices, 
  getNoticeById, 
  createNotice, 
  updateNoticeStatus, 
  verifyNotice, 
  revokeNotice 
} from '../controllers/noticeController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Public verification endpoint (allows students or visitors to verify by ID/QR without forcing login)
router.post('/verify', verifyNotice);

// Notice browsing
router.get('/', authenticateJWT, getNotices);
router.get('/:id', authenticateJWT, getNoticeById);

// Admin operations
router.post('/', authenticateJWT, authorizeRoles('administrator'), createNotice);
router.post('/:id/revoke', authenticateJWT, authorizeRoles('administrator'), revokeNotice);

// Approver operations
router.post('/:id/status', authenticateJWT, authorizeRoles('approver'), updateNoticeStatus);

export default router;

