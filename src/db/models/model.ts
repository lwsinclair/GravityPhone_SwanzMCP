import mongoose, { Document, Schema } from 'mongoose';

// Interface for Model document
export interface IModel extends Document {
  name: string;
  provider: string;
  version: string;
  parameters: {
    temperature: number;
    topP: number;
    maxTokens: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  capabilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Model
const ModelSchema = new Schema<IModel>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      index: true,
    },
    version: {
      type: String,
      required: true,
    },
    parameters: {
      temperature: {
        type: Number,
        default: 0.7,
      },
      topP: {
        type: Number,
        default: 1.0,
      },
      maxTokens: {
        type: Number,
        default: 4096,
      },
      frequencyPenalty: {
        type: Number,
        default: 0,
      },
      presencePenalty: {
        type: Number,
        default: 0,
      },
    },
    capabilities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Model model
export const Model = mongoose.model<IModel>('Model', ModelSchema); 