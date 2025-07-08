import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";
import { enhancedPrompt } from "@/utils/enhancePrompt";
import {
  checkSubscription,
  deductTokens,
  estimateTokens,
} from "@/utils/manageTokens";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    // const promptId = (await params).id
    // if(!mongoose.Types.ObjectId.isValid(promptId)) {
    //   return NextResponse.json({ message: 'invalid promptId' }, { status: 400 })
    // }
    const { content } = await req.json()

    const { tokenEstimated } = await req.json();
    if (!tokenEstimated) {
      return NextResponse.json(
        { message: "tokenEstimate not found" },
        { status: 404 }
      );
    }

    // const prompt = await Prompt.findOne({ _id: promptId })
    // if(!prompt){
    //   return NextResponse.json({ message: 'prompt not found' },{ status: 404 })
    // }

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

    const enhanced = await enhancedPrompt(content)
    if(!enhanced || !enhanced.response){
      return NextResponse.json({ message: "enhance not found"}, { status: 201 });
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
