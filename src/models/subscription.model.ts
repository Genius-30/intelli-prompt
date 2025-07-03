import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './user.model';

export interface ISubscription extends Document {
  ownerId: IUser['_id'];
  paymentId: string;
  amount: number;
  currency: string;
  plan: 'free' | 'pro' | 'enterpise';
  subscriptionStart: Date;
  subscriptionEnds: Date;
  createdAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    ownerId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    plan: { type: String, enum: ['free', 'pro', 'enterpise'], required: true },
    subscriptionStart: { type: Date, required: true },
    subscriptionEnds: { type: Date, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);