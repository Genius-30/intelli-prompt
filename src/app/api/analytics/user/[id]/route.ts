import { NextResponse } from 'next/server';
import { User } from '@/models/user.model';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { Prompt } from '@/models/prompt.model';
import { ModelResponse } from '@/models/modelResponse.model';
import { Folder } from '@/models/folder.model';
import { Subscription } from '@/models/subscription.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { getSetCache } from '@/lib/redisCache';

export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const data = await getSetCache(`userAnalytics:${userId}`, 60, () => getUserAnalytics(userId));
    
    return NextResponse.json({ message:'user analytics fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user analytics' }, { status: 500 });
  }
}

async function getUserAnalytics(userId: string) {
  const user = await User.findById(userId).lean();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const subscription = await Subscription.findOne({ ownerId: userId }).sort({ subscriptionEnds: -1 }).lean();

  const counts = await getCounts(userId);
  const engagements = await getEngagementStats(userId);

  // Other details
  const details = {
    ...counts,
    ...engagements,
    followerCount: user.followerCount || 0,
    followeeCount: user.followeeCount || 0,
    tokenLimit: user.tokenLimit || 0,
    tokensUsed: user.tokensUsed || 0,
    tokensLeft: user.tokenLimit - user.tokensUsed,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    plan: user.plan,
    streak: user.streak,
    subscription,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return details;
}

async function getCounts(userId: string) {
  const [promptCount, modelResponseCount, folderCount] = await Promise.all([
    Prompt.countDocuments({ ownerId: userId }),
    ModelResponse.countDocuments({ ownerId: userId }),
    Folder.countDocuments({ ownerId: userId })
  ]);
  
  return { promptCount, modelResponseCount, folderCount };
}

async function getEngagementStats(userId: string) {
  const sharedPrompts = await SharedPrompt.find({ ownerId: userId }).lean();

  let likes = 0, saves = 0, shares = 0, comments = 0;

  sharedPrompts.forEach((sp) => {
    likes += sp.likes?.length || 0;
    saves += sp.saves?.length || 0;
    shares += sp.shares?.length || 0;
    comments += sp.comments?.length || 0;
  });

  return { likes, saves, shares, comments };
}