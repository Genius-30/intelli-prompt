import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'
import { IFolder } from './folder.model';

export interface IPrompt extends Document {
  ownerId: IUser['_id'];
  folderId: IFolder['_id'];
  content: string;
  version: number;
  isCurrent: boolean;
  isFavorite: boolean;
}

const PromptSchema: Schema<IPrompt> = new Schema(
  {
    ownerId: { type: String, required: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    content: { type: String, required: true },
    version: { type: Number, required: true, default: 1 },
    isCurrent: { type: Boolean, default: true },
    isFavorite: { type: Boolean, default: false}
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);