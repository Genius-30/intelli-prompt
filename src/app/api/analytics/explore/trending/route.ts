import { NextRequest, NextResponse } from "next/server";

import { SharedPrompt } from "@/models/sharedPrompt.model";
import connectDb from "@/lib/db";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    // Try to get userId from session (if logged in)
    let userId: string | null = null;
    try {
      const authResult = await getAuthenticatedUser();
      if (authResult && !authResult.error && authResult.userId) {
        userId = authResult.userId;
      } else {
        userId = null;
      }
    } catch (e) {
      userId = null;
    }

    // Build a cache key that includes userId
    const cacheKey = userId ? `trendingPromptsWeekly:${userId}` : `trendingPromptsWeekly`;

    const data = await getSetCache(cacheKey, 60, () => getTrendingPosts(userId));

    return NextResponse.json({ message: "trending prompts fetched", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending prompts" }, { status: 500 });
  }
}

async function getTrendingPosts(userId?: string | null) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const baseProject: any = {
    title: 1,
    content: 1,
    tags: 1,
    modelUsed: 1,
    createdAt: 1,
    responseId: 1,
    likeCount: { $size: { $ifNull: ["$likes", []] } },
    saveCount: { $size: { $ifNull: ["$saves", []] } },
    shareCount: { $size: { $ifNull: ["$shares", []] } },
    commentCount: { $size: { $ifNull: ["$comments", []] } },
    "owner._id": 1,
    "owner.username": 1,
    "owner.avatar": 1,
    isUserLiked: 1,
    isUserSaved: 1,
    isUserShared: 1,
    isUserCommented: 1,
    isUserOwned: 1,
  };

  const pipeline: any[] = [
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
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
  ];

  pipeline.push({
    $addFields: userId
      ? {
          isUserLiked: { $in: [userId, { $ifNull: ["$likes", []] }] },
          isUserSaved: { $in: [userId, { $ifNull: ["$saves", []] }] },
          isUserShared: { $in: [userId, { $ifNull: ["$shares", []] }] },
          isUserCommented: {
            $anyElementTrue: {
              $map: {
                input: { $ifNull: ["$comments", []] },
                as: "comment",
                in: { $eq: ["$$comment.userId", userId] },
              },
            },
          },
          isUserOwned: { $eq: ["$ownerId", userId] },
        }
      : {
          isUserLiked: { $literal: false },
          isUserSaved: { $literal: false },
          isUserShared: { $literal: false },
          isUserCommented: { $literal: false },
          isUserOwned: { $literal: false },
        },
  });

  pipeline.push(
    { $project: baseProject },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: [{ $ifNull: ["$likeCount", 0] }, 1] },
            { $multiply: [{ $ifNull: ["$saveCount", 0] }, 3] },
            { $multiply: [{ $ifNull: ["$commentCount", 0] }, 5] },
            { $multiply: [{ $ifNull: ["$shareCount", 0] }, 8] },
          ],
        },
      },
    },
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 10 },
  );

  const prompts = await SharedPrompt.aggregate(pipeline);
  return prompts;
}
