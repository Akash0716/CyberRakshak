import mongoose, { Document, Schema } from 'mongoose';

export type NoticeStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected' | 'revoked';
export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface INotice extends Document {
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
  expiryDate: Date;
  publishedAt?: Date;
  revokedAt?: Date;
  revocationReason?: string;
  paymentDetailsReferenced?: {
    beneficiary?: string;
    upiId?: string;
    accountMasked?: string;
    purpose?: string;
    amount?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>({
  noticeId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, default: 'Academic' },
  department: { type: String, required: true },
  issuer: { type: String, required: true },
  issuerId: { type: String },
  approver: { type: String },
  approverId: { type: String },
  version: { type: Number, default: 1 },
  fileHash: { type: String, required: true },
  contentHash: { type: String, required: true },
  qrCodeUrl: { type: String },
  pdfAttachmentUrl: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['draft', 'pending_review', 'approved', 'published', 'rejected', 'revoked'], 
    default: 'pending_review',
    index: true 
  },
  rejectionReason: { type: String },
  expiryDate: { type: Date, required: true, index: true },
  publishedAt: { type: Date },
  revokedAt: { type: Date },
  revocationReason: { type: String },
  paymentDetailsReferenced: {
    beneficiary: String,
    upiId: String,
    accountMasked: String,
    purpose: String,
    amount: Number
  }
}, {
  timestamps: true
});

export const NoticeModel = mongoose.model<INotice>('Notice', NoticeSchema);

