import mongoose, { Document, Schema } from 'mongoose';

export type NoticeAction = 
  | 'created' 
  | 'submitted_for_review' 
  | 'approved' 
  | 'rejected' 
  | 'published' 
  | 'modified' 
  | 'revoked';

export interface INoticeHistory extends Document {
  noticeId: string;
  action: NoticeAction;
  performedBy: string;
  performedByRole: string;
  version: number;
  remarks?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const NoticeHistorySchema = new Schema<INoticeHistory>({
  noticeId: { type: String, required: true, index: true },
  action: { 
    type: String, 
    required: true,
    enum: ['created', 'submitted_for_review', 'approved', 'rejected', 'published', 'modified', 'revoked'] 
  },
  performedBy: { type: String, required: true },
  performedByRole: { type: String, required: true },
  version: { type: Number, required: true, default: 1 },
  remarks: { type: String },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true }
});

export const NoticeHistoryModel = mongoose.model<INoticeHistory>('NoticeHistory', NoticeHistorySchema);

