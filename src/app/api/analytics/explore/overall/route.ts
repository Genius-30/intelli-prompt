import { NextRequest, NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import connectDb from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { getSetCache } from '@/lib/redisCache';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    // Pagination: get page and limit from query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

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

    // Get total count for pagination (not cached)
    const total = await SharedPrompt.countDocuments();

    // Build a cache key that includes userId, page, and limit
    const cacheKey = userId
      ? `trendingPromptsOverall:${userId}:page=${page}:limit=${limit}`
      : `trendingPromptsOverall:page=${page}:limit=${limit}`;

    // Cache only the paginated data
    const data = await getSetCache(cacheKey, 60, () => getTrendingPosts(userId, skip, limit));

    return NextResponse.json({
      message: 'trending prompts fetched',
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending prompts' }, { status: 500 });
  }
}

async function getTrendingPosts(userId?: string | null, skip = 0, limit = 10) {
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
  };

  // If user is logged in, add isUserLiked and isUserSaved
  if (userId) {
    baseProject.isUserLiked = { $in: [userId, { $ifNull: ["$likes", []] }] };
    baseProject.isUserSaved = { $in: [userId, { $ifNull: ["$saves", []] }] };
  }

  return await SharedPrompt.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true
      }
    },
    { $project: baseProject }
  ]);
}
