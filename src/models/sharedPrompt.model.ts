import mongoose, { Document, Model, Schema } from "mongoose";

import { IUser } from "./user.model";

export interface IShared extends Document {
  ownerId: IUser["_id"];
  title: string;
  content: string;
  tags: string[];
  modelUsed: string;
  likes: IUser["_id"][];
  saves: IUser["_id"][];
  shares: IUser["_id"][];
  comments: {
    _id: Schema.Types.ObjectId;
    userId: IUser["_id"];
    content: string;
    likes: IUser["_id"][];
    createdAt: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SharedPromptSchema: Schema<IShared> = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    modelUsed: { type: String, required: true },
    likes: { type: [String], default: [] },
    saves: { type: [String], default: [] },
    shares: { type: [String], default: [] },
    comments: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, auto: true },
          userId: { type: String, required: true },
          content: { type: String, required: true },
          likes: { type: [String], default: [] },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

SharedPromptSchema.index({ tags: 1 });
SharedPromptSchema.index({ title: "text" });

export const SharedPrompt: Model<IShared> =
  mongoose.models.SharedPrompt ||
  mongoose.model<IShared>("SharedPrompt", SharedPromptSchema);
