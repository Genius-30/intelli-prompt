import { NextRequest, NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { rateLimit } from '@/lib/rateLimit';
import { getSetCache } from '@/lib/redisCache';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const {userId, error} = await getAuthenticatedUser()
    if(error) return error

    const data = await getSetCache('trendingUsersOverall', 60, () => getUserScore(userId));
    
    return NextResponse.json({ message:'trending users fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending users' }, { status: 500 });
  }
}

async function getUserScore(userId: any) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const prompts = await SharedPrompt.aggregate([
    {
      $match: {
        ownerId: userId,
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
    }
  ])

  return prompts[0]?.totalScore || 0;
}