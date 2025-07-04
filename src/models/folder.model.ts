import mongoose, {Schema, Model, Document } from "mongoose";
import { IUser } from './user.model'

export interface IFolder extends Document {
  title: string;
  ownerId: IUser['_id'];
}

const FolderSchema: Schema<IFolder> = new Schema(
  {
    title: { type: String, required: true, maxlength: 75 },
    ownerId: { type: String, required: true }
  },
  { timestamps: true }
)

export const Folder: Model<IFolder> = mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema)