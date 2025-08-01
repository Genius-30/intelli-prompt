import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { Version } from '@/models/version.model';
import { getSetCache } from '@/lib/redisCache';

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;    

    const data = await getSetCache('recentPrompts', 60, () => getRecentPrompts(userId));
    
    return NextResponse.json({ message: 'recent versions fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recent versions' }, { status: 500 });
  }
}

async function getRecentPrompts(userId:string) {
  return await Version.aggregate([
      {
        $match: { ownerId: userId }
      },
      {
        $sort: { updatedAt: -1, createdAt: -1 }
      },
      { $limit: 5 },
      {
        $lookup: {
          from: 'prompts',
          localField: 'promptId',
          foreignField: '_id',
          as: 'prompt'
        }
      },
      { 
        $unwind: { 
          path: '$prompt',
          preserveNullAndEmptyArrays: true 
        }
      },
      {
        $lookup: {
          from: 'folders',
          localField: 'prompt.folderId',
          foreignField: '_id',
          as: 'folder'
        }
      },
      { 
        $unwind: {
          path: '$folder', 
          preserveNullAndEmptyArrays: true 
        } 
      },
      {
        $project: {
          content: 1,
          updatedAt: 1,
          createdAt: 1,
          'prompt._id': 1,
          'prompt.title': 1,
          'folder._id': 1,
          'folder.title': 1
        }
      }
    ]);
}