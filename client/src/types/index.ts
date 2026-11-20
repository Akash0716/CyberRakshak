export type UserRole = 'student' | 'administrator' | 'approver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
}

export type NoticeStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected' | 'revoked';
export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notice {
  _id: string;
  noticeId: string;
  title: string;
  description: string;
  category: string;
  department: string;
  issuer: string;
  issuerId?: string;
  approver?: string;
  approverId?: string;
  version: number;
  fileHash: string;
  contentHash: string;
  qrCodeUrl?: string;
  pdfAttachmentUrl?: string;
  priority: NoticePriority;
  status: NoticeStatus;
  rejectionReason?: string;
  expiryDate: string;
  publishedAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  paymentDetailsReferenced?: {
    beneficiary?: string;
    upiId?: string;
    accountMasked?: string;
    purpose?: string;
    amount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NoticeHistory {
  _id?: string;
  noticeId: string;
  action: 'created' | 'submitted_for_review' | 'approved' | 'rejected' | 'published' | 'modified' | 'revoked';
  performedBy: string;
  performedByRole: string;
  version: number;
  remarks?: string;
  timestamp: string;
}

export interface PaymentRecord {
  _id: string;
  recordId: string;
  institution: string;
  beneficiary: string;
  bankName: string;
  maskedAccount: string;
  ifsc: string;
  upiId: string;
  purpose: string;
  validFrom: string;
  validTill: string;
  status: 'active' | 'inactive' | 'deprecated';
  notes?: string;
}

export interface Incident {
  _id: string;
  caseId: string;
  userId?: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  category: string;
  description: string;
  incidentDate: string;
  financialLoss?: number;
  evidenceFiles?: string[];
  status: 'submitted' | 'under_investigation' | 'resolved' | 'dismissed';
  adminRemarks?: string;
  isDemoSimulation?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AIAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  riskScore: number;
  category: string;
  indicators: string[];
  explanation: string;
  recommendedSteps: string[];
  safetyPrecautions: string[];
  disclaimer: string;
  source: 'gemini_api' | 'demo_advisory_engine';
  language: 'en' | 'te';
}

export interface VerificationResult {
  referenceId: string;
  noticeId: string;
  result: 'VERIFIED' | 'WARNING' | 'REJECTED' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND';
  statusBadge: {
    label: string;
    color: 'emerald' | 'amber' | 'rose' | 'slate' | 'sky';
  };
  isAuthentic: boolean;
  tamperDetected: boolean;
  reason: string;
  originalNotice: any;
  mismatches: Array<{
    field: string;
    label: string;
    originalValue: any;
    submittedValue: any;
    severity: 'critical' | 'high' | 'medium';
  }>;
  tamperSummary?: string;
  verificationTimestamp: string;
}

export interface PaymentVerificationResult {
  referenceId: string;
  result: 'MATCH' | 'MISMATCH' | 'REVIEW_REQUIRED';
  summary: string;
  recommendation: string;
  matchedRecord: any;
  discrepancies: Array<{
    field: string;
    label: string;
    approvedValue: string;
    enteredValue: string;
    status: 'MATCH' | 'MISMATCH';
  }>;
}

