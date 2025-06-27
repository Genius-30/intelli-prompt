import { Schema, models, model } from "mongoose";

export interface IPrompt {
  userId: string;
  title: string;
  prompt: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPrompt>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    variables: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Prompt = models.Prompt || model<IPrompt>("Prompt", PromptSchema);
