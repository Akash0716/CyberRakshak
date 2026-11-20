import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizScore {
  lessonId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export interface ILearningProgress extends Document {
  userId: string;
  completedLessons: string[];
  quizScores: IQuizScore[];
  badgesEarned: string[];
  updatedAt: Date;
}

const LearningProgressSchema = new Schema<ILearningProgress>({
  userId: { type: String, required: true, unique: true, index: true },
  completedLessons: [{ type: String }],
  quizScores: [
    {
      lessonId: { type: String, required: true },
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      completedAt: { type: Date, default: Date.now }
    }
  ],
  badgesEarned: [{ type: String }]
}, {
  timestamps: true
});

export const LearningProgressModel = mongoose.model<ILearningProgress>('LearningProgress', LearningProgressSchema);

