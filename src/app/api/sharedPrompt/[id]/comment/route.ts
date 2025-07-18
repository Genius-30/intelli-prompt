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
      return NextResponse.json({ message: "invalid sharedPromptId" },{ status: 400 });
    }

    const { content } = await req.json();
    if (!content || content.trim() === '') {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const newComment = {
      userId,
      content,
      likes: [],
      createdAt: new Date()
    };

    const comment = await SharedPrompt.findByIdAndUpdate(
      sharedPromptId, 
      {
        $push: { comments: newComment }
      },
      { new: true }
    );
    if(!comment) {
      return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment added successfully", comment }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error adding comment" }, { status: 500 });
  }
}