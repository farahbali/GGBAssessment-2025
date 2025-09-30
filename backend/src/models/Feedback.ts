import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'done'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
