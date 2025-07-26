import mongoose, { Document, Model, Schema } from "mongoose";

import { IUser } from "./user.model";

export interface IFollow extends Document {
  followerId: IUser["_id"];
  followeeId: IUser["_id"];
  createdAt?: Date;
  updatedAt?: Date;
}

const FollowSchema: Schema<IFollow> = new Schema(
  {
    followerId: { type: String, required: true },
    followeeId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Follow: Model<IFollow> =
  mongoose.models.Follow || mongoose.model<IFollow>("Follow", FollowSchema);
