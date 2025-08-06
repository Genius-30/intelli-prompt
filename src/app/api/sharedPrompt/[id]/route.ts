import "@/models/modelResponse.model";

import { NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";
import mongoose from "mongoose";

// delete sharedPrompt
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    await SharedPrompt.findOneAndDelete({
      _id: sharedPromptId,
      ownerId: userId,
    });

    return NextResponse.json({ message: "Prompt deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed deleting prompt" }, { status: 500 });
  }
}

// Update sharedPrompt title/tags
export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const { newTitle, tags, responseId, modelUsed } = await req.json();
    if (!newTitle || !responseId || !modelUsed || !tags || tags.length === 0) {
      return NextResponse.json({ message: "invalid input" }, { status: 400 });
    }

    await SharedPrompt.updateOne(
      { _id: sharedPromptId, ownerId: userId },
      {
        ...(newTitle && { title: newTitle }),
        ...(tags && { tags }),
        ...(responseId && { responseId }),
        ...(modelUsed && { modelUsed }),
      },
    );

    return NextResponse.json({ message: "sharedPrompt updated" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "error updating sharedPrompt" }, { status: 500 });
  }
}

// get specific sharedPrompt details
export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const data = await getSetCache(`sharedPrompt:${sharedPromptId}`, 60, () =>
      getSpecificSharedPrompt(sharedPromptId, userId),
    );
    if (!data || data.length === 0) {
      return NextResponse.json({ message: "sharedPrompt not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "sharedPrompt found", data: data[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed fetching sharedPrompt", err }, { status: 500 });
  }
}

async function getSpecificSharedPrompt(id: string, userId: string) {
  return await SharedPrompt.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "modelresponses",
        localField: "responseId",
        foreignField: "_id",
        as: "responseData",
      },
    },
    {
      $unwind: {
        path: "$responseData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        response: "$responseData.response",
        userId: "$owner._id",
        username: "$owner.username",
        avatar: "$owner.avatar",
        isUserOwned: { $eq: [userId, { $toString: "$owner._id" }] },
        isUserLiked: { $in: [userId, { $ifNull: ["$likes", []] }] },
        isUserSaved: { $in: [userId, { $ifNull: ["$saves", []] }] },
        isUserCommented: { $in: [userId, { $ifNull: ["$comments", []] }] },
        isUserShared: { $in: [userId, { $ifNull: ["$shares", []] }] },
        likeCount: { $size: { $ifNull: ["$likes", []] } },
        saveCount: { $size: { $ifNull: ["$saves", []] } },
        shareCount: { $size: { $ifNull: ["$shares", []] } },
        commentCount: { $size: { $ifNull: ["$comments", []] } },
      },
    },
    {
      $project: {
        _id: 1,
        versionId: 1,
        title: 1,
        content: 1,
        tags: 1,
        modelUsed: 1,
        createdAt: 1,
        userId: 1,
        username: 1,
        avatar: 1,
        isUserOwned: 1,
        likeCount: 1,
        saveCount: 1,
        shareCount: 1,
        commentCount: 1,
        isUserLiked: 1,
        isUserSaved: 1,
        isUserCommented: 1,
        isUserShared: 1,
        response: 1,
      },
    },
  ]);
}
