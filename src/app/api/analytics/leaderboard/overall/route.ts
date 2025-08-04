import { NextRequest, NextResponse } from "next/server";

import { SharedPrompt } from "@/models/sharedPrompt.model";
import connectDb from "@/lib/db";
import { getSetCache } from "@/lib/redisCache";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    const data = await getSetCache("trendingUsersOverall", 60, getTrendingUsers);

    return NextResponse.json({ message: "trending users fetched", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending users" }, { status: 500 });
  }
}

async function getTrendingUsers() {
  return await SharedPrompt.aggregate([
    {
      $project: {
        ownerId: 1,
        likes: 1,
        score: {
          $add: [
            { $multiply: [{ $size: { $ifNull: ["$likes", []] } }, 1] },
            { $multiply: [{ $size: { $ifNull: ["$saves", []] } }, 3] },
            { $multiply: [{ $size: { $ifNull: ["$comments", []] } }, 5] },
            { $multiply: [{ $size: { $ifNull: ["$shares", []] } }, 8] },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$ownerId",
        totalScore: { $sum: "$score" },
        totalSharedPrompts: { $sum: 1 },
        totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    {
      $limit: 20,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        totalScore: 1,
        totalSharedPrompts: 1,
        totalLikes: 1,
        "user.fullname": 1,
        "user.username": 1,
        "user.avatar": 1,
        "user.streak.best": 1,
      },
    },
  ]);
}
