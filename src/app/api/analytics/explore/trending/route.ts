import { NextRequest, NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import connectDb from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';
import { getSetCache } from '@/lib/redisCache';

// score calculation: likes*1 + shares*8 + saves*3 + comments*5
function getScore(prompt: any): number {
  return (
    (prompt.likes?.length || 0) * 1 +
    (prompt.saves?.length || 0) * 3 +
    (prompt.comments?.length || 0) * 5 +
    (prompt.shares?.length || 0) * 8
  );
}

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    const data = await getSetCache('trendingPromptsWeekly', 60, getTrendingPosts);

    return NextResponse.json({ message:'trending prompts fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending prompts' }, { status: 500 });
  }
}

async function getTrendingPosts() {
  const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const prompts = await SharedPrompt.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
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
  ]);

  const scoredPrompts = prompts.map(p => ({ ...p, score: getScore(p) }));

  scoredPrompts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  return scoredPrompts.slice(0, 20);
}