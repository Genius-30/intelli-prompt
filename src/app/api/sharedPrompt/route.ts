import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";
import { rateLimit } from "@/lib/rateLimit";

// create a sharedPrompt
export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { title, content, tags, versionId, responseId } = await req.json();
    if (!title || !content || !responseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSharedPrompt = await SharedPrompt.create({
      ownerId: userId,
      versionId,
      title,
      content,
      tags: tags || [],
      responseId,
    });
    if (!newSharedPrompt) {
      return NextResponse.json({ error: "Failed to create shared prompt" }, { status: 500 });
    }

    return NextResponse.json({ message: "Prompt shared successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to share prompt" }, { status: 500 });
  }
}

// get all sharedPrompt for community section
export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    const data = await getSetCache("allSharedPromptsByCommunity", 60, getAllSharedPrompts);
    if (!data) {
      return NextResponse.json({ message: "sharedPrompts not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "all sharedPrompt fetched", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed fetching all sharedPrompts" }, { status: 500 });
  }
}

function getAllSharedPrompts() {
  return SharedPrompt.aggregate([
    { $sort: { createdAt: -1 } },
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
      $project: {
        title: 1,
        content: 1,
        tags: 1,
        versionId: 1,
        responseId: 1,
        createdAt: 1,
        likeCount: { $size: { $ifNull: ["$likes", []] } },
        saveCount: { $size: { $ifNull: ["$saves", []] } },
        shareCount: { $size: { $ifNull: ["$shares", []] } },
        commentCount: { $size: { $ifNull: ["$comments", []] } },
        "owner.username": 1,
        "owner.avatar": 1,
        "owner._id": 1,
      },
    },
  ]);
}
