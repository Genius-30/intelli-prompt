
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { User } from "@/models/user.model";
import { Subscription } from "@/models/subscription.model";

export async function GET() {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const subscription = await Subscription.findOne({ ownerId: userId })
      .sort({ subscriptionEnds: -1 }).lean();

    const plan = user.plan;
    const price = subscription?.amount || 0;
    const currency = subscription?.currency || "USD";
    const tokenLimit = user.tokenLimit;
    const tokenUsed = user.tokensUsed;
    const usedPercentage = tokenLimit > 0 ? Math.round((tokenUsed / tokenLimit) * 100) : 0;
    const remainingTokens = tokenLimit - tokenUsed;
    const expiresOn = user.subscriptionEnds;

    return NextResponse.json({
      plan,
      price,
      currency,
      tokenUsed,
      tokenLimit,
      usedPercentage,
      remainingTokens,
      expiresOn,
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error fetching billing info", err }, { status: 500 });
  }
}