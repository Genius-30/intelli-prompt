import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './user.model'
import { IFolder } from './folder.model';

export interface IPrompt extends Document {
  ownerId: IUser['_id'];
  folderId: IFolder['_id'];
  title: string;
  content: string;
  version: string;
  isCurrent: boolean;
  isFavorite: boolean;
}

const PromptSchema: Schema<IPrompt> = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    title: { type: String, required: true, trim: true},
    content: { type: String, required: true },
    version: { type: String, required: true, default: '1.0'},
    isCurrent: { type: Boolean, default: true },
    isFavorite: { type: Boolean, default: false}
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);