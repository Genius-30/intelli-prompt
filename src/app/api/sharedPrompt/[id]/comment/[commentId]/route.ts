import { NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import mongoose from 'mongoose';

// DELETE a comment from a shared prompt
export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    const commentId = (await params).commentId;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ message: "invalid sharedPromptId or commentId" }, { status: 400 });
    }

    await SharedPrompt.findByIdAndUpdate(
      sharedPromptId,
      { 
        $pull: { comments: { _id: commentId, userId } } 
      },
    );

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed deleting comment' }, { status: 500 });
  }
}