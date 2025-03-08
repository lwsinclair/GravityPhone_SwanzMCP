import mongoose, { Document, Schema } from 'mongoose';

// Interface for Message document
export interface IMessage extends Document {
  threadId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: {
    tokenCount?: number;
    promptTokens?: number;
    completionTokens?: number;
    toolCalls?: {
      name: string;
      arguments: Record<string, any>;
      result?: string;
    }[];
    safetyFlags?: {
      category: string;
      severity: 'low' | 'medium' | 'high';
      details?: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Message
const MessageSchema = new Schema<IMessage>(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      tokenCount: {
        type: Number,
      },
      promptTokens: {
        type: Number,
      },
      completionTokens: {
        type: Number,
      },
      toolCalls: [
        {
          name: {
            type: String,
          },
          arguments: {
            type: Schema.Types.Mixed,
          },
          result: {
            type: String,
          },
        },
      ],
      safetyFlags: [
        {
          category: {
            type: String,
          },
          severity: {
            type: String,
            enum: ['low', 'medium', 'high'],
          },
          details: {
            type: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Message model
export const Message = mongoose.model<IMessage>('Message', MessageSchema); 