import { NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

// to share sharedPrompt
export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const prompt = await SharedPrompt.findById(sharedPromptId);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    if (!prompt.shares.includes(userId)) {
      prompt.shares.push(userId);
    }
    await prompt.save();

    return NextResponse.json(
      { message: "sharedPrompt shared", isShared: true, sharesCount: prompt.shares.length },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: "err sharing sharedPrompt" }, { status: 500 });
  }
}
