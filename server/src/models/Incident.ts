import mongoose, { Document, Schema } from 'mongoose';

export type IncidentCategory = 
  | 'Phishing' 
  | 'OTP Fraud' 
  | 'UPI Fraud' 
  | 'Fake Customer-Care Calls' 
  | 'QR Code Scams' 
  | 'Fake College Notices' 
  | 'Identity Theft' 
  | 'Other Cybercrime';

export type IncidentStatus = 
  | 'submitted' 
  | 'under_investigation' 
  | 'resolved' 
  | 'dismissed';

export interface IIncident extends Document {
  caseId: string;
  userId?: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  category: IncidentCategory;
  description: string;
  incidentDate: Date;
  financialLoss?: number;
  evidenceFiles?: string[];
  status: IncidentStatus;
  adminRemarks?: string;
  isDemoSimulation?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>({
  caseId: { type: String, required: true, unique: true, index: true },
  userId: { type: String },
  reporterName: { type: String, default: 'Anonymous Student' },
  reporterEmail: { type: String },
  reporterPhone: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Phishing', 
      'OTP Fraud', 
      'UPI Fraud', 
      'Fake Customer-Care Calls', 
      'QR Code Scams', 
      'Fake College Notices', 
      'Identity Theft', 
      'Other Cybercrime'
    ],
    index: true
  },
  description: { type: String, required: true },
  incidentDate: { type: Date, required: true, default: Date.now },
  financialLoss: { type: Number, default: 0 },
  evidenceFiles: [{ type: String }],
  status: { 
    type: String, 
    enum: ['submitted', 'under_investigation', 'resolved', 'dismissed'], 
    default: 'submitted',
    index: true
  },
  adminRemarks: { type: String },
  isDemoSimulation: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const IncidentModel = mongoose.model<IIncident>('Incident', IncidentSchema);

