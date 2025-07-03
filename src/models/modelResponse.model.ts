import mongoose, { Schema, Model } from 'mongoose'
import { IPrompt } from './prompt.model';
import { IUser } from './user.model';

export interface IModelResponse {
  promptId: IPrompt['_id'];
  ownerId: IUser['_id'];
  model: string;
  temperature: number;
  response: string;
  isFavorite: boolean;
  isCreated: Date;
}

const ModelResponseSchema: Schema<IModelResponse> = new Schema(
  {
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    model: { type: String, required: true },
    temperature: { type: Number, required: true, default: 0.7 },
    response: { type: String, required: true },
    isFavorite: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ModelResponse: Model<IModelResponse> = mongoose.models.ModelResponse || mongoose.model<IModelResponse>('ModelResponse', ModelResponseSchema);