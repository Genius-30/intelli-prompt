import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from './user.model'
import { IPrompt } from './prompt.model';

export interface ITokenUsage {
  userId: IUser['_id'];
  promptId: IPrompt['_id'];
  date: Date;
  model: string;
  tokenUsed: number;
  requestMade: number;
  actionType: 'enhance' | 'test';
  createdAt: Date;
}

const TokenUsageSchema: Schema<ITokenUsage> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
    date: { type: Date, required: true },
    model: { type: String, required: true },
    tokenUsed: { type: Number, required: true, default: 0 },
    requestMade: { type: Number, required: true, default: 0 },
    actionType: { type: String, enum: ['enhance', 'test'], required: true}
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const TokenUsage: Model<ITokenUsage> = mongoose.models.TokenUsage || mongoose.model<ITokenUsage>('TokenUsage', TokenUsageSchema);