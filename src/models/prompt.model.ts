import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'

interface IEnhancedPrompt {
  version: string;
  content: string;
  createdAt?: Date;
}

interface IModelResponse {
  model: string;
  response: string;
  createdAt?: Date;
}

export interface IPrompt extends Document {
  owner: IUser['_id'];
  title: string;
  rawPrompt: string;
  enhancedPrompts: IEnhancedPrompt[];
  modelResponses: IModelResponse[];
}

const PromptSchema: Schema<IPrompt> = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 75},
    rawPrompt: { type: String, required: true },
    enhancedPrompts: [
      {
        version: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    modelResponses: [
      {
        model: String,
        response: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);
