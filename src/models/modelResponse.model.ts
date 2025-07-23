import mongoose, { Schema, Model } from 'mongoose'
import { IUser } from './user.model';
import { IVersion } from './version.model';

export interface IModelResponse {
  versionId: IVersion['_id'];
  ownerId: IUser['_id'];
  model: string;
  temperature: number;
  response: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ModelResponseSchema: Schema<IModelResponse> = new Schema(
  {
    versionId: { type: Schema.Types.ObjectId, ref: 'Version', required: true },
    ownerId: { type: String, required: true, index: true },
    model: { type: String, required: true },
    temperature: { type: Number, required: true, default: 0.7 },
    response: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ModelResponse: Model<IModelResponse> = mongoose.models.ModelResponse || mongoose.model<IModelResponse>('ModelResponse', ModelResponseSchema);