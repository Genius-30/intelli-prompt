import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'
import { IFolder } from './folder.model';

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
  folder: IFolder['_id'];
  title: string;
  rawPrompt: string;
  enhancedPrompts: IEnhancedPrompt[];
  modelResponses: IModelResponse[];
}

const PromptSchema: Schema<IPrompt> = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    title: { type: String, required: true, maxlength: 75},
    rawPrompt: { type: String, required: true },
    enhancedPrompts: [
      {
        version: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    modelResponses: [
      {
        model: { type: String, required: true },
        response: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);
