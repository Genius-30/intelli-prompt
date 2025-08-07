import { IModelResponse, callOpenRouter } from "@/utils/models";
import { NextRequest, NextResponse } from "next/server";
import { checkSubscription, deductTokens, isEnoughToken } from "@/utils/manageTokens";
import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Version } from "@/models/version.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { rateLimit } from "@/lib/rateLimit";

// to test prompt on models
export async function POST(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { versionId, content, models, tokenEstimated } = await req.json();
    if ((!versionId && !content) || !Array.isArray(models) || models.length === 0) {
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

    let promptContent = "";
    if(content){
      promptContent = content.trim();
    } else if (versionId){
      const versionDoc = await Version.findById(versionId);
      if (!versionDoc?.content) {
        return NextResponse.json({ message: "version or content not found" }, { status: 404 });
      }
      promptContent = versionDoc.content.trim();
    }

    const results = await Promise.all(
      models.map(async (modelOption) => {
        const result = (await callOpenRouter({
          ...modelOption,
          messages: [{ role: "user", content: promptContent }],
        })) as IModelResponse;

        await deductTokens({ userId, tokensUsed: result.tokensUsed || 0 });

        return {
          ...modelOption,
          model: getModelNameById(modelOption.model),
          tokensUsed: result.tokensUsed,
          temperature: result.temperature,
          response: result.response,
          error: result.error,
        };
      }),
    );

    return NextResponse.json({ message: "testing completed", results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "error while testing model", err }, { status: 500 });
  }
}

function getModelNameById(modelId: string): string | undefined {
  for (const provider of Object.values(AI_MODELS)) {
    const found = provider.models.find((m) => m.id === modelId);
    if (found) return found.name;
  }
  return undefined;
}
