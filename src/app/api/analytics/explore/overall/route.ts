import { NextRequest, NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import connectDb from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { getSetCache } from '@/lib/redisCache';

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    const data = await getSetCache('trendingPromptsOverall', 60, getTrendingPosts);

    return NextResponse.json({ message:'trending prompts fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending prompts' }, { status: 500 });
  }
}

async function getTrendingPosts() {
  return await SharedPrompt.aggregate([
    {
      $sort: { createdAt: -1 }
    },
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
    {
      $addFields: {
        latestComments: {
          $slice: [
            {
              $reverseArray: {
                $sortArray: {
                  input: { $ifNull: ["$comments", []] },
                  sortBy: { createdAt: 1 }
                }
              }
            },
            3
          ]
        }
      }
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
        latestComments: 1,
        "owner._id": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        "owner.rank": 1
      }
    }
  ])
}
