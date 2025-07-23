import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'
import { IFolder } from './folder.model';

export interface IPrompt extends Document {
  ownerId: IUser['_id'];
  folderId: IFolder['_id'];
  title: string;
  totalVersions: number;
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PromptSchema: Schema<IPrompt> = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null, index: true },
    title: { type: String, required: true },
    totalVersions: { type: Number, required: true, default: 1 },
    isFavorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);