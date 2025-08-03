import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";
import { Prompt } from "@/models/prompt.model";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { User } from "@/models/user.model";
import connectDb from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    // const { userId, error } = await getAuthenticatedUser();
    // if (error) return error;
    await connectDb()
    const {userId} = await req.json()
  
    const data = await getSetCache(`userStats:${userId}`, 60 , () => getUserStats(userId)) 

    return NextResponse.json({ message: 'user stats fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}

async function getUserStats(userId: string) {
  // Date calculations
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
  startOfThisWeek.setHours(0, 0, 0, 0);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setMilliseconds(-1);

  // Stats for this and last month
  const [
    totalPrompts,
    lastMonthPrompts,
    totalSharedPrompts,
    lastMonthSharedPrompts,
    user,
    sharedPromptLikes,
    lastWeekLikes
  ] = await Promise.all([
    Prompt.countDocuments({ ownerId: userId }),
    Prompt.countDocuments({ ownerId: userId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    SharedPrompt.countDocuments({ ownerId: userId }),
    SharedPrompt.countDocuments({ ownerId: userId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    User.findById({ _id: userId }, { tokensUsed: 1, tokenLimit: 1, _id: 0 }),
    SharedPrompt.aggregate([
      { $match: { ownerId: userId } },
      { $group: { _id: null, totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } } } }
    ]),
    SharedPrompt.aggregate([
      { $match: { ownerId: userId, createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek } } },
      { $group: { _id: null, totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } } } }
    ])
  ]);

  const tokenUsage = user?.tokensUsed || 0;
  const tokenLimit = user?.tokenLimit || 1000;
  const totalLikes = sharedPromptLikes[0]?.totalLikes || 0;
  const lastWeekTotalLikes = lastWeekLikes[0]?.totalLikes || 0;

  // Format values
  const formattedTokenUsage = tokenUsage >= 1000 ? `${(tokenUsage / 1000).toFixed(1)}K` : tokenUsage.toString();
  // Calculate trends
  const promptsDiff = totalPrompts - lastMonthPrompts;
  const sharedPromptsDiff = totalSharedPrompts - lastMonthSharedPrompts;
  const likesDiff = totalLikes - lastWeekTotalLikes;
  // Calculate progress
  const tokenUsageProgress = tokenLimit > 0 ? Math.round((tokenUsage / tokenLimit) * 100) : 0;
  const tokenUsageProgressLabel = `${tokenUsageProgress}% of monthly limit`;

  return {
    totalPrompts: {
      label: 'Total Prompts',
      value: totalPrompts,
      trend: `${promptsDiff >= 0 ? '+' : ''}${promptsDiff} from last month`
    },
    tokenUsage: {
      label: 'Token Usage',
      value: formattedTokenUsage,
      progress: tokenUsageProgress,
      progressLabel: tokenUsageProgressLabel
    },
    communityLikes: {
      label: 'Community Likes',
      value: totalLikes,
      trend: `${likesDiff >= 0 ? '+' : ''}${likesDiff} this week`
    },
    sharedPrompts: {
      label: 'Shared Prompts',
      value: totalSharedPrompts,
      trend: `${sharedPromptsDiff >= 0 ? '+' : ''}${sharedPromptsDiff} this month`
    }
  };
}