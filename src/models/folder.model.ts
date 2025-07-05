import mongoose, {Schema, Model, Document } from "mongoose";
import { IUser } from './user.model'
import { IPrompt } from "./prompt.model";

export interface IFolder extends Document {
  title: string;
  ownerId: IUser['_id'];
  isFavorite: boolean;
  totalVersions: number;
  activeVersion: IPrompt['_id'];
}

const FolderSchema: Schema<IFolder> = new Schema(
  {
    title: { type: String, required: true, maxlength: 75 },
    ownerId: { type: String, required: true },
    isFavorite: { type: Boolean, default: false},
    totalVersions: { type: Number, required: true, default: 0 },
    activeVersion: { type: Schema.Types.ObjectId, ref: 'Prompt', default: null }
  },
  { timestamps: true }
)

export const Folder: Model<IFolder> = mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema)