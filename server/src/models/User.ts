import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'student' | 'administrator' | 'approver';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'administrator', 'approver'], 
    default: 'student',
    required: true 
  },
  department: { type: String, default: 'General' },
  studentId: { type: String, default: '' }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

