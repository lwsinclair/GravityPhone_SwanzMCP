import mongoose, { Document, Schema } from 'mongoose';

// Interface for Thread document
export interface IThread extends Document {
  title: string;
  modelId: mongoose.Types.ObjectId;
  metadata: {
    userId: string;
    projectId?: string;
    tags: string[];
    context?: string;
    safetyScore?: number;
  };
  challenges: {
    name: string;
    description: string;
    category: string;
    severity: 'low' | 'medium' | 'high';
    status: 'identified' | 'mitigated' | 'unresolved';
    notes?: string;
  }[];
  status: 'active' | 'archived' | 'flagged';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Thread
const ThreadSchema = new Schema<IThread>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    modelId: {
      type: Schema.Types.ObjectId,
      ref: 'Model',
      required: true,
      index: true,
    },
    metadata: {
      userId: {
        type: String,
        required: true,
        index: true,
      },
      projectId: {
        type: String,
        index: true,
      },
      tags: {
        type: [String],
        default: [],
        index: true,
      },
      context: {
        type: String,
      },
      safetyScore: {
        type: Number,
        min: 0,
        max: 10,
      },
    },
    challenges: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
          index: true,
        },
        severity: {
          type: String,
          enum: ['low', 'medium', 'high'],
          required: true,
          index: true,
        },
        status: {
          type: String,
          enum: ['identified', 'mitigated', 'unresolved'],
          default: 'identified',
          index: true,
        },
        notes: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'archived', 'flagged'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Thread model
export const Thread = mongoose.model<IThread>('Thread', ThreadSchema); 