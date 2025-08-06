import { NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

// toggle comment like on sharedPrompt
export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    const commentId = (await params).commentId;

    if (
      !mongoose.Types.ObjectId.isValid(sharedPromptId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return NextResponse.json({ message: "invalid sharedPromptId or commentId" }, { status: 400 });
    }

    const prompt = await SharedPrompt.findById(sharedPromptId);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const comment = prompt.comments.find((c) => c._id.toString() === commentId.toString());
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    const alreadyLiked = comment.likes.includes(userId);
    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }
    await prompt.save();

    return NextResponse.json(
      {
        message: "sharedPrompt comment like toggled",
        likeCount: comment.likes.length,
        isUserLiked: !alreadyLiked,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "err toggle comment like on sharedPrompt" },
      { status: 500 },
    );
  }
}
