import mongoose, {Schema, Model, Document } from "mongoose";
import { IUser } from './user.model'

export interface IFolder extends Document {
  name: string;
  owner: IUser['_id'];
  createdAt?: Date;
}

const FolderSchema: Schema<IFolder> = new Schema(
  {
    name: { type: String, required: true, maxlength: 75 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

export const Folder: Model<IFolder> = mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema)