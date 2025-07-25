import { SharedPrompt } from "@/models/sharedPrompt.model";
import connectDb from "@/lib/db";

export async function getAllSharedPrompts() {
  await connectDb();
  return await SharedPrompt.find();
}
