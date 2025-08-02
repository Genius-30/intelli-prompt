import { NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import mongoose from 'mongoose';
import '@/models/modelResponse.model';

// delete sharedPrompt
export async function DELETE(
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

    await SharedPrompt.findOneAndDelete({
      _id: sharedPromptId,
      ownerId: userId,
    });

    return NextResponse.json({ message: 'Prompt deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed deleting prompt' }, { status: 500 });
  }
}

// Update sharedPrompt title/tags
export async function PATCH(
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

    const { newTitle, tags } = await req.json();
    if (!newTitle && (!tags || tags.length === 0)) {
      return NextResponse.json({ message: "invalid title" }, { status: 400 });
    }

    await SharedPrompt.updateOne(
      { _id: sharedPromptId, ownerId: userId },
      {
        ...(newTitle && { title: newTitle }),
        ...(tags && { tags })
      }
    );

    return NextResponse.json({ message: "sharedPrompt updated" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "error updating sharedPrompt" }, { status: 500 });
  }
}

// get specific sharedPrompt details
export async function GET(
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
    
    const sharedPrompt = await SharedPrompt.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(sharedPromptId),
        },
      },
      {
        $lookup: {
          from: 'modelresponses', 
          localField: 'responseId',
          foreignField: '_id',
          as: 'responseData',
        },
      },
      {
        $unwind: {
          path: '$responseData',
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $addFields: {
          response: '$responseData.response',
        },
      },
      {
        $project: {
          responseData: 0,
          responseId: 0, 
          __v: 0,
        },
      },
    ]);
    if (!sharedPrompt) {
      return NextResponse.json({ message: "sharedPrompt not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "sharedPrompt found", sharedPrompt }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed fetching sharedPrompt', err }, { status: 500 });
  }
}