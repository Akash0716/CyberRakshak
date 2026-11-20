import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentRecord extends Document {
  recordId: string;
  institution: string;
  beneficiary: string;
  bankName: string;
  accountNumber: string;
  maskedAccount: string;
  ifsc: string;
  upiId: string;
  purpose: string;
  validFrom: Date;
  validTill: Date;
  status: 'active' | 'inactive' | 'deprecated';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRecordSchema = new Schema<IPaymentRecord>({
  recordId: { type: String, required: true, unique: true },
  institution: { type: String, required: true, default: 'Vishnu Institute of Technology' },
  beneficiary: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true }, // Keep internally for comparison
  maskedAccount: { type: String, required: true }, // For public display: "XXXX-XXXX-8921"
  ifsc: { type: String, required: true },
  upiId: { type: String, required: true, index: true },
  purpose: { type: String, required: true },
  validFrom: { type: Date, required: true },
  validTill: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive', 'deprecated'], default: 'active' },
  notes: { type: String }
}, {
  timestamps: true
});

export const PaymentRecordModel = mongoose.model<IPaymentRecord>('PaymentRecord', PaymentRecordSchema);

