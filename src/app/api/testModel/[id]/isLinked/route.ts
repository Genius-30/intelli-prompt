import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { SharedPrompt } from "@/models/sharedPrompt.model";
import mongoose from "mongoose";

export default async function handler(
  req: NextRequest,
  { params }: { params: any } 
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const responseId = (await params).id
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
      return NextResponse.json({ message: "responseId is required" }, { status: 400 });
    }
  
    const linkedPrompts = await SharedPrompt.find({ responseId }).select("_id title");

    if (linkedPrompts.length > 0) {
      return NextResponse.json({
        linked: true,
        linkedCount: linkedPrompts.length,
        prompts: linkedPrompts,
        message: `Deleting this response will also remove ${linkedPrompts.length} shared prompt(s).`
      });
    }

    return NextResponse.json({ linked: false }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", err }, { status: 500 });
  }
}
