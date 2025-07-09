import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { enhancedPrompt } from "@/utils/enhancePrompt";
import { checkSubscription, deductTokens, estimateTokens } from "@/utils/manageTokens";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { content, tokenEstimated } = await req.json();
    if (!tokenEstimated) {
      return NextResponse.json(
        { message: "tokenEstimate not found" },
        { status: 404 }
      );
    }

    const subs = await checkSubscription({ userId });
    if (!subs.success) {
      return NextResponse.json(
        { message: "subscription expired" },
        { status: 400 }
      );
    }

    const tokens = await estimateTokens({ userId, tokenEstimated });
    if (!tokens.success) {
      return NextResponse.json(
        { message: "not enough token" },
        { status: 400 }
      );
    }

    const enhanced = await enhancedPrompt(content);
    if (!enhanced || !enhanced.response) {
      return NextResponse.json(
        { message: "enhance not found" },
        { status: 201 }
      );
    }

    await deductTokens({ userId, tokensUsed: enhanced.tokensUsed });

    return NextResponse.json(
      { message: "enhanced", response: enhanced.response },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "err while enhancing", err },
      { status: 500 }
    );
  }
}
