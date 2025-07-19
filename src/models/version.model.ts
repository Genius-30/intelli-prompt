import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'
import { IPrompt } from './prompt.model';

export interface IVersion extends Document {
  ownerId: IUser['_id'];
  promptId: IPrompt['_id'];
  versionNumber: number;
  content: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const VersionSchema: Schema<IVersion> = new Schema(
  {
    ownerId: { type: String, required: true },
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', default: null },
    versionNumber: { type: Number, required: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isFavorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Version: Model<IVersion> = mongoose.models.Version || mongoose.model<IVersion>('Version', VersionSchema);