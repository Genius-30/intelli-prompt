import { NextResponse } from 'next/server';
import { User } from '@/models/user.model';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { Prompt } from '@/models/prompt.model';
import { ModelResponse } from '@/models/modelResponse.model';
import { Folder } from '@/models/folder.model';
import { Subscription } from '@/models/subscription.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Subscription details (latest)
    const subscription = await Subscription.findOne({ ownerId: userId }).sort({ subscriptionEnds: -1 }).lean();

    // Prompts, ModelResponses, Folders count
    const [promptCount, modelResponseCount, folderCount] = await Promise.all([
      Prompt.countDocuments({ ownerId: userId }),
      ModelResponse.countDocuments({ ownerId: userId }),
      Folder.countDocuments({ ownerId: userId })
    ]);

    // SharedPrompts by user
    const sharedPrompts = await SharedPrompt.find({ ownerId: userId }).lean();

    // Engagement stats
    let likes = 0, saves = 0, shares = 0, comments = 0;
    sharedPrompts.forEach(sp => {
      likes += sp.likes?.length || 0;
      saves += sp.saves?.length || 0;
      shares += sp.shares?.length || 0;
      comments += sp.comments?.length || 0;
    });

    // Followers and following
    const followerCount = user.followerCount || 0;
    const followeeCount = user.followeeCount || 0;

    // Token info
    const tokensUsed = user.tokensUsed || 0;
    const tokenLimit = user.tokenLimit || 0;
    const tokensLeft = tokenLimit - tokensUsed;

    // Rank
    const rank = user.rank;

    // Other details
    const details = {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan,
      streak: user.streak,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const fullDetails = {
      tokensUsed, tokensLeft, tokenLimit, subscription, promptCount, modelResponseCount, folderCount, likes, saves, shares, comments, followerCount, followeeCount, rank, ...details
    };
    
    return NextResponse.json({ message:'user analytics fetched', fullDetails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user analytics' }, { status: 500 });
  }
}