import { NextRequest, NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getSetCache } from "@/lib/redisCache";
import connectDb from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";

// to get all sharedPrompts of specific user
export async function GET(
  req:NextRequest,
  { params } : { params: any }
) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    const personId = (await params).id
    if(!personId){
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const data = await getSetCache(`allSharedPromptsByUser_${personId}`, 60, () => getAllSharedPrompts(personId))
    if(!data){
      return NextResponse.json({ message: 'sharedPrompts not found' }, { status: 404 })
    }

    return NextResponse.json({ message: "user details fetched", data }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: "err fetching user details" }, { status: 500 });
  }
}

async function getAllSharedPrompts(personId: string) {
  return await SharedPrompt.aggregate([
    {
      $match: { ownerId: personId } 
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $project: {
        title: 1,
        content: 1,
        tags: 1,
        modelUsed: 1,
        createdAt: 1,
        likeCount: { $size: { $ifNull: ["$likes", []] } },
        saveCount: { $size: { $ifNull: ["$saves", []] } },
        shareCount: { $size: { $ifNull: ["$shares", []] } },
        commentCount: { $size: { $ifNull: ["$comments", []] } },
      }
    }
  ])
}
