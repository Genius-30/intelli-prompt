import { NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import mongoose from 'mongoose';

// add a comment to the sharedPrompt
export async function POST(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const { content } = await req.json();
    if (!content || content.trim() === '') {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const prompt = await SharedPrompt.findById(sharedPromptId, { comments: 1 });
    if (!prompt) {
      return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
    }

    const alreadyCommented = prompt.comments.some((c: any) => c.userId === userId);
    if (alreadyCommented) {
      return NextResponse.json({ message: "User has already commented" }, { status: 400 });
    }

    const newComment = {
      userId,
      content,
      likes: [],
      createdAt: new Date()
    };

    const updatedPrompt = await SharedPrompt.findByIdAndUpdate(
      sharedPromptId,
      { $push: { comments: newComment } },
      { new: true }
    );
    if(!updatedPrompt){
      return NextResponse.json({ message: "Couldn't add comment" }, { status: 400 });
    }

    return NextResponse.json({ message: "Comment added successfully", comment: newComment }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error adding comment" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const prompt = await SharedPrompt.findById(sharedPromptId, { comments: 1 });
    if (!prompt) {
      return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
    }

    const allComments = prompt.comments || [];
    const userComments = allComments.filter((c: any) => c.userId === userId);
    const otherComments = allComments.filter((c: any) => c.userId !== userId);

    return NextResponse.json({ message: "Comments fetched", allComments: otherComments, userComment: userComments.length ? userComments[0] : null }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error fetching comments" }, { status: 500 });
  }
}

