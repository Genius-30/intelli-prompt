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

    // Pagination: get page and limit from query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim();
    const skip = (page - 1) * limit;

    // Try to get userId from session (if logged in)
    let userId: string | null = null;
    try {
      const authResult = await getAuthenticatedUser();
      userId = authResult?.userId || null;
    } catch (e) {
      userId = null;
    }

    // Build a cache key that includes userId, page, and limit
    const cacheKey = userId
      ? `trendingPromptsOverall:${userId}:page=${page}:limit=${limit}:search=${search || ""}`
      : `trendingPromptsOverall:page=${page}:limit=${limit}:search=${search || ""}`;

    // Get total count for pagination
    const total = await SharedPrompt.countDocuments(
      search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { content: { $regex: search, $options: "i" } },
              { tags: { $in: [new RegExp(search, "i")] } },
            ],
          }
        : {},
    );

    // Cache only the paginated data
    const data = await getSetCache(cacheKey, 60, () =>
      getTrendingPosts({ userId, skip, limit, search }),
    );

    const hasMore = page * limit < total;

    return NextResponse.json(
      {
        message: "trending prompts fetched",
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending prompts" }, { status: 500 });
  }
}

async function getTrendingPosts({
  userId,
  skip = 0,
  limit = 10,
  search,
}: {
  userId?: string | null;
  skip?: number;
  limit?: number;
  search?: string | null;
}) {
  const matchStage = search
    ? {
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
          ],
        },
      }
    : null;

  const baseProject: any = {
    title: 1,
    content: 1,
    versionId: 1,
    tags: 1,
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

  return await SharedPrompt.aggregate([
    ...(matchStage ? [matchStage] : []),
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
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
    ...(userId
      ? [
          {
            $addFields: {
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
            },
          },
        ]
      : [
          {
            $addFields: {
              isUserLiked: { $literal: false },
              isUserSaved: { $literal: false },
              isUserShared: { $literal: false },
              isUserCommented: { $literal: false },
              isUserOwned: { $literal: false },
            },
          },
        ]),
    { $project: baseProject },
  ]);
}
