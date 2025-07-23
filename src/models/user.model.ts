import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: string; // clerkId
  fullname: string;
  username: string;
  bio: string;
  email: string;
  avatar: string;
  plan: "Free" | "Premium" | "Enterprise";
  rank: 'Rookie' | 'Cadet' | 'Elite' | 'Veteran' | 'Master';
  subscriptionEnds: Date;
  streak: {
    current: number;
    best: number;
    lastActive: Date;
    history: Date[];
  };
  tokenLimit: number;
  tokensUsed: number;
  followerCount: number;
  followeeCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    _id: { type: String, required: true, }, // clerkId
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    plan: {
      type: String,
      enum: ["Free", "Premium", "Enterprise"],
      default: "Free",
    },
    rank: {
      type: String,
      enum: ["Rookie", "Cadet", "Elite","Veteran","Master"],
      default: "Rookie",
    },
    subscriptionEnds: {
      type: Date,
      required: true,
      default: () => new Date(new Date().setMonth(new Date().getMonth() + 12)),
    },
    streak: {
      current: { type: Number, default: 0 },
      best: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
      history: [{ type: Date }],
    },
    tokenLimit: { type: Number, default: 1000 },
    tokensUsed: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    followeeCount: { type: Number, default: 0 },
  },
  { _id: false, timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
