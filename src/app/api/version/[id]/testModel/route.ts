import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { callOpenRouter } from '@/utils/models'
import { checkSubscription, deductTokens, isEnoughToken } from "@/utils/manageTokens";
import { Version } from "@/models/version.model";
import { rateLimit } from "@/lib/rateLimit";
import { IModelResponse } from "@/utils/models";

// to test prompt on models
export async function POST(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { models, tokenEstimated } = await req.json();
    const versionId = (await params).id;
    if (!versionId || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json({ error: "Prompt and models are required." }, { status: 400 });
    }

    const subs = await checkSubscription({ userId });
    if (!subs.success) {
      return NextResponse.json({ message: "Subscription expired" }, { status: 400 });
    }

    const tokens = await isEnoughToken({ userId, tokenEstimated });
    if (!tokens.success) {
      return NextResponse.json({ message: "Not enough token" }, { status: 400 });
    }

    const versionDoc = await Version.findById(versionId);
    if (!versionDoc?.content) {
      return NextResponse.json({ message: "version or content not found" }, { status: 404 });
    }

    const content = versionDoc.content

    const results = await Promise.all(
      models.map(async (modelOption) => {
        const result = (await callOpenRouter({
          ...modelOption,
          messages: [{ role: "user", content }]
        })) as IModelResponse;

        await deductTokens({ userId, tokensUsed: result.tokensUsed || 0 });

        return {
          ...modelOption,
          tokensUsed: result.tokensUsed,
          temperature: result.temperature,
          response: result.response,
          error: result.error
        };
      })
    );

    return NextResponse.json({ message:'testing completed', results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'error while testing model', err }, { status: 500 });
  }
}
