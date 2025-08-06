import { NextRequest, NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { User } from "@/models/user.model";
import connectDb from "@/lib/db";
import { getSetCache } from "@/lib/redisCache";
import { rateLimit } from "@/lib/rateLimit";

// Search sharedPrompts by title, username, or tags
export async function GET(request: NextRequest) {
  try {
    const result = await rateLimit(request);
    if (result) return result;

    await connectDb();

    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const username = searchParams.get("username");
    const tags = searchParams.get("tags"); // comma-separated

    const query: any = {};
    if (title) {
      query.title = { $regex: title };
    }

    if (username) {
      const users = await User.find({ username: { $regex: username } })
        .select("_id")
        .lean();
      const userIds = users.map((u) => u._id);
      if (userIds.length === 0) {
        return NextResponse.json({ results: [] }, { status: 200 });
      }
      query.ownerId = { $in: userIds };
    }

    if (tags) {
      const tagsArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagsArr.length > 0) {
        query.tags = { $in: tagsArr };
      }
    }

    const data = await getSetCache("searchedResults", 60, () =>
      getSearchResults(query)
    );

    return NextResponse.json(
      { message: "searching sharedPrompts successful", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search sharedPrompts" },
      { status: 500 }
    );
  }
}

async function getSearchResults(query: any) {
  return await SharedPrompt.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: "users",             
        localField: "ownerId",       
        foreignField: "_id",     
        as: "owner",
      }
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        title: 1,
        content: 1,
        tags: 1,
        createdAt: 1,
        likeCount: { $size: { $ifNull: ["$likes", []] } },
        saveCount: { $size: { $ifNull: ["$saves", []] } },
        shareCount: { $size: { $ifNull: ["$shares", []] } },
        commentCount: { $size: { $ifNull: ["$comments", []] } },
        "owner.username": 1,
        "owner.avatar": 1,
        "owner._id": 1,
      }
    }
  ]);
}
