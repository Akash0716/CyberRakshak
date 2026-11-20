import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isUsingFallbackDB } from '../config/db.js';
import { NoticeModel, INotice } from '../models/Notice.js';
import { NoticeHistoryModel } from '../models/NoticeHistory.js';
import { memoryDb } from '../services/memoryDbFallback.js';
import { generateNoticeIntegrityHash } from '../utils/hash.js';
import { generateQRCodeDataUrl } from '../utils/qrGenerator.js';
import { verifyNoticeAuthenticity } from '../services/noticeVerificationService.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getNotices(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, category, search } = req.query;

    let notices: any[] = [];
    if (isUsingFallbackDB()) {
      notices = [...memoryDb.notices];
    } else {
      try {
        notices = await NoticeModel.find().sort({ createdAt: -1 }).lean();
      } catch {
        notices = [...memoryDb.notices];
      }
    }

    // Role filtering: Students only see published or revoked notices unless searching by specific ID
    if (req.user?.role === 'student') {
      notices = notices.filter(n => ['published', 'revoked'].includes(n.status));
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      notices = notices.filter(n => n.status === status);
    }

    // Filter by category
    if (category && category !== 'all') {
      notices = notices.filter(n => n.category.toLowerCase() === (category as string).toLowerCase());
    }

    // Search query
    if (search) {
      const q = (search as string).toLowerCase();
      notices = notices.filter(n => 
        n.noticeId.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        n.issuer.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: notices.length,
      notices
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getNoticeById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    let notice: any = null;

    if (isUsingFallbackDB()) {
      notice = memoryDb.notices.find(n => n.noticeId.toLowerCase() === id.toLowerCase() || n._id.toString() === id);
    } else {
      try {
        notice = await NoticeModel.findOne({
          $or: [
            { noticeId: { $regex: new RegExp(`^${id}$`, 'i') } },
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
          ]
        }).lean();
      } catch {
        notice = memoryDb.notices.find(n => n.noticeId.toLowerCase() === id.toLowerCase() || n._id.toString() === id);
      }
    }

    if (!notice) {
      res.status(404).json({ success: false, message: 'Notice not found.' });
      return;
    }

    // Fetch audit timeline
    let history: any[] = [];
    if (isUsingFallbackDB()) {
      history = memoryDb.noticeHistories
        .filter(h => h.noticeId.toLowerCase() === notice.noticeId.toLowerCase())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      try {
        history = await NoticeHistoryModel.find({ noticeId: notice.noticeId })
          .sort({ timestamp: -1 })
          .lean();
      } catch {
        history = memoryDb.noticeHistories.filter(h => h.noticeId.toLowerCase() === notice.noticeId.toLowerCase());
      }
    }

    res.json({
      success: true,
      notice,
      history
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createNotice(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      category = 'Academic',
      department,
      expiryDate,
      priority = 'medium',
      pdfAttachmentUrl,
      paymentDetailsReferenced
    } = req.body;

    if (!title || !description || !department || !expiryDate) {
      res.status(400).json({ success: false, message: 'Title, description, department, and expiry date are required.' });
      return;
    }

    const year = new Date().getFullYear();
    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    const noticeId = `VIT-NOT-${year}-${randomSerial}`;

    const issuer = req.user ? `${req.user.name} (${req.user.department || 'Administration'})` : 'Administrative Authority';
    const issuerId = req.user?.userId;

    const contentHash = generateNoticeIntegrityHash({
      title,
      department,
      issuer,
      description,
      expiryDate,
      category
    });

    const qrPayload = JSON.stringify({
      noticeId,
      contentHash,
      title,
      issuer,
      v: 1
    });

    const qrCodeUrl = await generateQRCodeDataUrl(qrPayload);

    const newNoticeData: any = {
      _id: `not_${Date.now()}`,
      noticeId,
      title,
      description,
      category,
      department,
      issuer,
      issuerId,
      version: 1,
      fileHash: contentHash,
      contentHash,
      qrCodeUrl,
      pdfAttachmentUrl: pdfAttachmentUrl || '',
      priority,
      status: 'pending_review', // Created notices require independent approval
      expiryDate: new Date(expiryDate),
      paymentDetailsReferenced,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const initialHistory = {
      _id: `h_${Date.now()}`,
      noticeId,
      action: 'created' as const,
      performedBy: issuer,
      performedByRole: req.user?.role || 'administrator',
      version: 1,
      remarks: 'Notice drafted and queued for independent dual-authorization review.',
      timestamp: new Date()
    };

    if (isUsingFallbackDB()) {
      memoryDb.notices.unshift(newNoticeData);
      memoryDb.noticeHistories.unshift(initialHistory);
    } else {
      try {
        await NoticeModel.create(newNoticeData);
        await NoticeHistoryModel.create(initialHistory);
      } catch {
        memoryDb.notices.unshift(newNoticeData);
        memoryDb.noticeHistories.unshift(initialHistory);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Notice created successfully and forwarded for Independent Approver review.',
      notice: newNoticeData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateNoticeStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { action, remarks } = req.body; // action: 'approve' | 'reject' | 'request_modifications'

    if (!['approve', 'reject', 'request_modifications'].includes(action)) {
      res.status(400).json({ success: false, message: 'Invalid action. Must be approve, reject, or request_modifications.' });
      return;
    }

    const approverName = req.user ? `${req.user.name} (${req.user.role})` : 'Independent Approver';
    const approverId = req.user?.userId;

    let notice: any = null;
    if (isUsingFallbackDB()) {
      notice = memoryDb.notices.find(n => n.noticeId === id || n._id.toString() === id);
      if (notice) {
        if (action === 'approve') {
          notice.status = 'published';
          notice.approver = approverName;
          notice.approverId = approverId;
          notice.publishedAt = new Date();
        } else if (action === 'reject') {
          notice.status = 'rejected';
          notice.approver = approverName;
          notice.approverId = approverId;
          notice.rejectionReason = remarks || 'Notice rejected by independent approver.';
        } else if (action === 'request_modifications') {
          notice.status = 'draft';
          notice.rejectionReason = remarks || 'Modifications requested by approver.';
        }
        notice.updatedAt = new Date();

        memoryDb.noticeHistories.unshift({
          noticeId: notice.noticeId,
          action: action === 'approve' ? 'approved' : 'rejected',
          performedBy: approverName,
          performedByRole: req.user?.role || 'approver',
          version: notice.version,
          remarks: remarks || (action === 'approve' ? 'Notice verified & published.' : 'Notice rejected.'),
          timestamp: new Date()
        });
      }
    } else {
      try {
        notice = await NoticeModel.findOne({
          $or: [
            { noticeId: id },
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
          ]
        });

        if (notice) {
          if (action === 'approve') {
            notice.status = 'published';
            notice.approver = approverName;
            notice.approverId = approverId;
            notice.publishedAt = new Date();
          } else if (action === 'reject') {
            notice.status = 'rejected';
            notice.approver = approverName;
            notice.approverId = approverId;
            notice.rejectionReason = remarks || 'Notice rejected by independent approver.';
          } else if (action === 'request_modifications') {
            notice.status = 'draft';
            notice.rejectionReason = remarks || 'Modifications requested by approver.';
          }

          await notice.save();

          await NoticeHistoryModel.create({
            noticeId: notice.noticeId,
            action: action === 'approve' ? 'approved' : 'rejected',
            performedBy: approverName,
            performedByRole: req.user?.role || 'approver',
            version: notice.version,
            remarks: remarks || (action === 'approve' ? 'Notice verified & published.' : 'Notice rejected.'),
            timestamp: new Date()
          });
        }
      } catch {
        // Fallback
      }
    }

    if (!notice) {
      res.status(404).json({ success: false, message: 'Notice not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Notice status updated to ${notice.status}.`,
      notice
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function verifyNotice(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { 
      noticeId, 
      submittedTitle, 
      submittedDepartment, 
      submittedIssuer, 
      submittedDescription, 
      submittedExpiryDate, 
      submittedHash,
      submittedPaymentDetails,
      verificationType 
    } = req.body;

    if (!noticeId) {
      res.status(400).json({ success: false, message: 'Notice ID is required for verification.' });
      return;
    }

    const verificationResult = await verifyNoticeAuthenticity({
      noticeId,
      submittedTitle,
      submittedDepartment,
      submittedIssuer,
      submittedDescription,
      submittedExpiryDate,
      submittedHash,
      submittedPaymentDetails,
      verificationType: verificationType || 'notice_id',
      clientIp: req.ip,
      userId: req.user?.userId,
      userRole: req.user?.role
    });

    res.json({
      success: true,
      ...verificationResult
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function revokeNotice(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({ success: false, message: 'Revocation reason is required.' });
      return;
    }

    let notice: any = null;
    const adminName = req.user ? `${req.user.name} (${req.user.role})` : 'Administrator';

    if (isUsingFallbackDB()) {
      notice = memoryDb.notices.find(n => n.noticeId === id || n._id.toString() === id);
      if (notice) {
        notice.status = 'revoked';
        notice.revokedAt = new Date();
        notice.revocationReason = reason;

        memoryDb.noticeHistories.unshift({
          noticeId: notice.noticeId,
          action: 'revoked',
          performedBy: adminName,
          performedByRole: req.user?.role || 'administrator',
          version: notice.version,
          remarks: `Revoked with reason: ${reason}`,
          timestamp: new Date()
        });
      }
    } else {
      try {
        notice = await NoticeModel.findOne({
          $or: [
            { noticeId: id },
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
          ]
        });

        if (notice) {
          notice.status = 'revoked';
          notice.revokedAt = new Date();
          notice.revocationReason = reason;
          await notice.save();

          await NoticeHistoryModel.create({
            noticeId: notice.noticeId,
            action: 'revoked',
            performedBy: adminName,
            performedByRole: req.user?.role || 'administrator',
            version: notice.version,
            remarks: `Revoked with reason: ${reason}`,
            timestamp: new Date()
          });
        }
      } catch {
        // Fallback
      }
    }

    if (!notice) {
      res.status(404).json({ success: false, message: 'Notice not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Notice revoked successfully and flagged across campus verification nodes.',
      notice
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

