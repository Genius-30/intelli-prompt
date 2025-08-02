import { NextRequest, NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { rateLimit } from '@/lib/rateLimit';
import { getSetCache } from '@/lib/redisCache';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const cacheKey = `userScoreAndRank:${userId}`;
    const data = await getSetCache(cacheKey, 60, () => getUserScoreAndRank(userId));

    return NextResponse.json({ message: 'user score and rank fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user score and rank' }, { status: 500 });
  }
}

async function getUserScoreAndRank(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const userScores = await SharedPrompt.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $project: {
        ownerId: 1,
        score: {
          $add: [
            { $multiply: [{ $size: { $ifNull: ['$likes', []] } }, 1] },
            { $multiply: [{ $size: { $ifNull: ['$saves', []] } }, 3] },
            { $multiply: [{ $size: { $ifNull: ['$comments', []] } }, 5] },
            { $multiply: [{ $size: { $ifNull: ['$shares', []] } }, 8] }
          ]
        }
      }
    },
    {
      $group: {
        _id: '$ownerId',
        totalScore: { $sum: '$score' }
      }
    },
    { $sort: { totalScore: -1 } }
  ]);

  // Find the user's totalScore and rank
  let userTotalScore = 0;
  let userRank = null;
  for (let i = 0; i < userScores.length; i++) {
    if (userScores[i]._id == userId) {
      userTotalScore = userScores[i].totalScore;
      userRank = i + 1; // rank is 1-based
      break;
    }
  }

  return {
    userId,
    totalScore: userTotalScore,
    rank: userRank,
    totalUsers: userScores.length
  };
}