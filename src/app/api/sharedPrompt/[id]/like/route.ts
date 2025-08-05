import { NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

// toggle like sharedPrompt
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

    const alreadyLiked = prompt.likes.includes(userId);

    if (alreadyLiked) {
      prompt.likes = prompt.likes.filter((id) => id !== userId);
    } else {
      prompt.likes.push(userId);
    }
    await prompt.save();

    return NextResponse.json(
      {
        message: "sharedPrompt like toggled",
        isLiked: !alreadyLiked,
        likesCount: prompt.likes.length,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: "err toggle like sharedPrompt", err }, { status: 500 });
  }
}
