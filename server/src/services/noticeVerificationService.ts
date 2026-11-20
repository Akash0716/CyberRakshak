import { v4 as uuidv4 } from 'uuid';
import { isUsingFallbackDB } from '../config/db.js';
import { NoticeModel, INotice } from '../models/Notice.js';
import { VerificationLogModel, IVerificationLog, VerificationResult } from '../models/VerificationLog.js';
import { memoryDb } from './memoryDbFallback.js';
import { generateNoticeIntegrityHash } from '../utils/hash.js';

export interface VerificationInput {
  noticeId: string;
  submittedTitle?: string;
  submittedDepartment?: string;
  submittedIssuer?: string;
  submittedDescription?: string;
  submittedExpiryDate?: string | Date;
  submittedHash?: string;
  submittedPaymentDetails?: {
    beneficiary?: string;
    upiId?: string;
    accountMasked?: string;
  };
  clientIp?: string;
  userId?: string;
  userRole?: string;
  verificationType?: 'notice_id' | 'notice_qr' | 'notice_tamper_check';
}

export interface VerificationOutput {
  referenceId: string;
  noticeId: string;
  result: VerificationResult;
  statusBadge: {
    label: string;
    color: 'emerald' | 'amber' | 'rose' | 'slate' | 'sky';
  };
  isAuthentic: boolean;
  tamperDetected: boolean;
  reason: string;
  originalNotice: {
    title: string;
    department: string;
    issuer: string;
    approver?: string;
    status: string;
    priority: string;
    version: number;
    issueDate: Date;
    expiryDate: Date;
    contentHash: string;
    description: string;
    paymentDetails?: any;
    pdfAttachmentUrl?: string;
    publishedAt?: Date;
    revokedAt?: Date;
    revocationReason?: string;
  } | null;
  mismatches: Array<{
    field: string;
    label: string;
    originalValue: any;
    submittedValue: any;
    severity: 'critical' | 'high' | 'medium';
  }>;
  tamperSummary?: string;
  verificationTimestamp: Date;
}

export async function verifyNoticeAuthenticity(input: VerificationInput): Promise<VerificationOutput> {
  const referenceId = `VER-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const cleanId = input.noticeId.trim();

  // Find notice in database or memory fallback
  let originalNotice: INotice | null = null;
  if (isUsingFallbackDB()) {
    originalNotice = memoryDb.notices.find(n => n.noticeId.toLowerCase() === cleanId.toLowerCase()) || null;
  } else {
    try {
      originalNotice = await NoticeModel.findOne({ 
        noticeId: { $regex: new RegExp(`^${cleanId}$`, 'i') } 
      });
    } catch {
      originalNotice = memoryDb.notices.find(n => n.noticeId.toLowerCase() === cleanId.toLowerCase()) || null;
    }
  }

  // Case 1: NOT FOUND
  if (!originalNotice) {
    const output: VerificationOutput = {
      referenceId,
      noticeId: cleanId,
      result: 'NOT_FOUND',
      statusBadge: { label: 'Notice Not Found', color: 'rose' },
      isAuthentic: false,
      tamperDetected: false,
      reason: `No registered institutional circular found matching ID "${cleanId}". Beware of forged credentials.`,
      originalNotice: null,
      mismatches: [],
      verificationTimestamp: new Date()
    };

    await logVerificationRecord(referenceId, input, 'NOT_FOUND', output.reason);
    return output;
  }

  const mismatches: VerificationOutput['mismatches'] = [];

  // Check field discrepancies if submitted info is provided
  if (input.submittedTitle && input.submittedTitle.trim().toLowerCase() !== originalNotice.title.trim().toLowerCase()) {
    mismatches.push({
      field: 'title',
      label: 'Notice Title',
      originalValue: originalNotice.title,
      submittedValue: input.submittedTitle,
      severity: 'critical'
    });
  }

  if (input.submittedDepartment && input.submittedDepartment.trim().toLowerCase() !== originalNotice.department.trim().toLowerCase()) {
    mismatches.push({
      field: 'department',
      label: 'Issuing Department',
      originalValue: originalNotice.department,
      submittedValue: input.submittedDepartment,
      severity: 'high'
    });
  }

  if (input.submittedIssuer && input.submittedIssuer.trim().toLowerCase() !== originalNotice.issuer.trim().toLowerCase()) {
    mismatches.push({
      field: 'issuer',
      label: 'Authorizing Officer',
      originalValue: originalNotice.issuer,
      submittedValue: input.submittedIssuer,
      severity: 'high'
    });
  }

  if (input.submittedDescription && input.submittedDescription.trim() !== originalNotice.description.trim()) {
    mismatches.push({
      field: 'description',
      label: 'Official Notice Body Content',
      originalValue: originalNotice.description,
      submittedValue: input.submittedDescription,
      severity: 'critical'
    });
  }

  if (input.submittedExpiryDate) {
    const subDate = new Date(input.submittedExpiryDate).toISOString().split('T')[0];
    const origDate = new Date(originalNotice.expiryDate).toISOString().split('T')[0];
    if (subDate !== origDate) {
      mismatches.push({
        field: 'expiryDate',
        label: 'Validity Expiration Date',
        originalValue: origDate,
        submittedValue: subDate,
        severity: 'high'
      });
    }
  }

  // Check payment discrepancies if referenced in notice
  if (input.submittedPaymentDetails && originalNotice.paymentDetailsReferenced) {
    if (input.submittedPaymentDetails.upiId && 
        originalNotice.paymentDetailsReferenced.upiId && 
        input.submittedPaymentDetails.upiId.trim().toLowerCase() !== originalNotice.paymentDetailsReferenced.upiId.trim().toLowerCase()) {
      mismatches.push({
        field: 'paymentUpiId',
        label: 'Referenced Bank UPI ID',
        originalValue: originalNotice.paymentDetailsReferenced.upiId,
        submittedValue: input.submittedPaymentDetails.upiId,
        severity: 'critical'
      });
    }
  }

  // Check content cryptographic hash
  if (input.submittedHash && originalNotice.contentHash) {
    if (input.submittedHash.trim().toLowerCase() !== originalNotice.contentHash.trim().toLowerCase()) {
      mismatches.push({
        field: 'contentHash',
        label: 'Cryptographic SHA-256 Digest',
        originalValue: originalNotice.contentHash.substring(0, 16) + '...',
        submittedValue: input.submittedHash.substring(0, 16) + '...',
        severity: 'critical'
      });
    }
  }

  const now = new Date();
  const isExpired = new Date(originalNotice.expiryDate) < now;

  let result: VerificationResult = 'VERIFIED';
  let reason = 'Notice is genuine, cryptographically valid, and approved by college authorities.';
  let badgeColor: 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' = 'emerald';
  let badgeLabel = 'VERIFIED – Genuine & Authentic';
  let isAuthentic = true;
  let tamperDetected = false;

  if (originalNotice.status === 'revoked') {
    result = 'REVOKED';
    reason = `This notice was formally revoked and withdrawn by college administration on ${originalNotice.revokedAt ? new Date(originalNotice.revokedAt).toLocaleDateString() : 'earlier date'}. Reason: ${originalNotice.revocationReason || 'Administrative cancellation'}`;
    badgeColor = 'rose';
    badgeLabel = 'REVOKED – Circular Withdrawn';
    isAuthentic = false;
  } else if (originalNotice.status === 'rejected') {
    result = 'REJECTED';
    reason = `Notice was rejected by the independent approver and has NOT been authorized for campus circulation. Rejection remark: ${originalNotice.rejectionReason || 'Non-compliance'}`;
    badgeColor = 'rose';
    badgeLabel = 'REJECTED – Not Approved';
    isAuthentic = false;
  } else if (mismatches.length > 0) {
    result = 'WARNING';
    tamperDetected = true;
    reason = `WARNING: Tampering detected! ${mismatches.length} critical field(s) differ from the official Vishnu campus cryptographic record.`;
    badgeColor = 'amber';
    badgeLabel = 'WARNING – Content Tampered';
    isAuthentic = false;
  } else if (isExpired) {
    result = 'EXPIRED';
    reason = `Notice validity expired on ${new Date(originalNotice.expiryDate).toLocaleDateString()}. Information may no longer be applicable.`;
    badgeColor = 'slate';
    badgeLabel = 'EXPIRED – Past Validity Period';
    isAuthentic = true; // Was genuine, but is expired
  } else if (originalNotice.status !== 'published') {
    result = 'REVIEW_REQUIRED';
    reason = `Notice is currently under '${originalNotice.status}' status and has not completed dual-authorization publication.`;
    badgeColor = 'sky';
    badgeLabel = 'PENDING REVIEW – Unapproved';
    isAuthentic = false;
  }

  const output: VerificationOutput = {
    referenceId,
    noticeId: originalNotice.noticeId,
    result,
    statusBadge: { label: badgeLabel, color: badgeColor },
    isAuthentic,
    tamperDetected,
    reason,
    originalNotice: {
      title: originalNotice.title,
      department: originalNotice.department,
      issuer: originalNotice.issuer,
      approver: originalNotice.approver,
      status: originalNotice.status,
      priority: originalNotice.priority,
      version: originalNotice.version,
      issueDate: originalNotice.createdAt,
      expiryDate: originalNotice.expiryDate,
      contentHash: originalNotice.contentHash,
      description: originalNotice.description,
      paymentDetails: originalNotice.paymentDetailsReferenced,
      pdfAttachmentUrl: originalNotice.pdfAttachmentUrl,
      publishedAt: originalNotice.publishedAt,
      revokedAt: originalNotice.revokedAt,
      revocationReason: originalNotice.revocationReason
    },
    mismatches,
    tamperSummary: mismatches.length > 0 
      ? `Discrepancies identified in: ${mismatches.map(m => m.label).join(', ')}` 
      : undefined,
    verificationTimestamp: new Date()
  };

  await logVerificationRecord(
    referenceId, 
    input, 
    result, 
    reason, 
    originalNotice, 
    mismatches.map(m => m.field)
  );

  return output;
}

async function logVerificationRecord(
  referenceId: string,
  input: VerificationInput,
  result: VerificationResult,
  reason: string,
  originalSnapshot?: any,
  mismatchFields?: string[]
) {
  const logData = {
    referenceId,
    userId: input.userId,
    userRole: input.userRole || 'student',
    verificationType: input.verificationType || 'notice_id',
    targetIdentifier: input.noticeId,
    result,
    reason,
    originalSnapshot,
    submittedSnapshot: {
      submittedTitle: input.submittedTitle,
      submittedDepartment: input.submittedDepartment,
      submittedIssuer: input.submittedIssuer,
      submittedDescription: input.submittedDescription,
      submittedExpiryDate: input.submittedExpiryDate,
      submittedPaymentDetails: input.submittedPaymentDetails
    },
    mismatches: mismatchFields,
    clientIp: input.clientIp,
    timestamp: new Date()
  };

  if (isUsingFallbackDB()) {
    memoryDb.verificationLogs.unshift(logData);
  } else {
    try {
      await VerificationLogModel.create(logData);
    } catch {
      memoryDb.verificationLogs.unshift(logData);
    }
  }
}

