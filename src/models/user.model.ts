import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionEnds: Date;
  tokenLimit: number;
  tokensUsed: number;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    _id: { type: String, required: true }, // clerkId
    name: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    subscriptionEnds: { type: Date , required: true, default: new Date(new Date().setMonth(new Date().getMonth() + 12)) },
    tokenLimit: { type: Number, default: 1000 },
    tokensUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
)

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)