import mongoose, { Document, Schema } from 'mongoose';

export type VerificationType = 'notice_id' | 'notice_qr' | 'notice_tamper_check' | 'payment_guard';
export type VerificationResult = 'VERIFIED' | 'WARNING' | 'REJECTED' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND' | 'MATCH' | 'MISMATCH' | 'REVIEW_REQUIRED';

export interface IVerificationLog extends Document {
  referenceId: string;
  userId?: string;
  userRole?: string;
  verificationType: VerificationType;
  targetIdentifier: string; // Notice ID or UPI / Account number
  result: VerificationResult;
  reason: string;
  originalSnapshot?: Record<string, any>;
  submittedSnapshot?: Record<string, any>;
  mismatches?: string[];
  clientIp?: string;
  timestamp: Date;
}

const VerificationLogSchema = new Schema<IVerificationLog>({
  referenceId: { type: String, required: true, unique: true, index: true },
  userId: { type: String },
  userRole: { type: String, default: 'student' },
  verificationType: { 
    type: String, 
    required: true,
    enum: ['notice_id', 'notice_qr', 'notice_tamper_check', 'payment_guard'] 
  },
  targetIdentifier: { type: String, required: true },
  result: { 
    type: String, 
    required: true,
    enum: ['VERIFIED', 'WARNING', 'REJECTED', 'EXPIRED', 'REVOKED', 'NOT_FOUND', 'MATCH', 'MISMATCH', 'REVIEW_REQUIRED'],
    index: true
  },
  reason: { type: String, required: true },
  originalSnapshot: { type: Schema.Types.Mixed },
  submittedSnapshot: { type: Schema.Types.Mixed },
  mismatches: [{ type: String }],
  clientIp: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

export const VerificationLogModel = mongoose.model<IVerificationLog>('VerificationLog', VerificationLogSchema);

