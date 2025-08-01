import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";
import { Prompt } from "@/models/prompt.model";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { User } from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;
  
    const data = await getSetCache('userStats', 60 , () => getUserStats(userId)) 

    return NextResponse.json({ message: 'user stats fetched', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}

async function getUserStats(userId: string){
  const [
      totalPrompts,
      totalSharedPrompts,
      user,
      sharedPromptLikes
    ] = await Promise.all([
      Prompt.countDocuments({ ownerId: userId }),
      SharedPrompt.countDocuments({ ownerId: userId }),
      User.findById({ _id: userId }, { tokensUsed: 1, _id: 0 }),
      SharedPrompt.aggregate([
        { $match: { ownerId: userId } },
        { $group: { _id: null, totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } } } }
      ])
    ]);

    const tokenUsage = user?.tokensUsed || 0;
    const totalLikes = sharedPromptLikes[0]?.totalLikes || 0;

    const data = {
      totalPrompts,
      totalSharedPrompts,
      tokenUsage,
      totalLikes
    };

    return data
}