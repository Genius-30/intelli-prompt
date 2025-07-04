import { NextRequest, NextResponse } from 'next/server';
import { testPromptOnModels } from '@/utils/testModels';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { ModelResponse } from '@/models/modelResponse.model'
import { Prompt } from '@/models/prompt.model'
import { checkSubscription, deductTokens, estimateTokens } from '@/utils/manageTokens';
import { IResponse } from '@/utils/enhancePrompt';

// tests prompt on models
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { prompt,  models, tokenEstimated } = await req.json();
    if (!prompt || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json({ error: 'Prompt and models are required.' }, { status: 400 });
    }

    const promptDoc = await Prompt.findOne({ content: prompt.trim(), ownerId: userId });
    if (!promptDoc) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    const subs = await checkSubscription({ userId })
    if(!subs.success){
      return NextResponse.json({ message:'subscription expired' }, { status: 400 });
    }

    const tokens = await estimateTokens({ userId, tokenEstimated })
    if(!tokens.success){
      return NextResponse.json({ message:'not enough token' }, { status: 400 });
    }

    const results = await Promise.all(
      models.map(async (modelOption) => {
        const result = await testPromptOnModels({ ...modelOption, prompt }) as IResponse;

        await ModelResponse.create({
          promptId: promptDoc._id,
          ownerId: userId,
          model: modelOption.model,
          temperature: modelOption.temperature,
          response: result.response,
          isFavorite: false
        })

        await deductTokens({ userId, tokensUsed: result.tokensUsed})
        
        return {
          ...modelOption,
          response: result.response
        };
      })
    );

    return NextResponse.json({ message:'testing completed', results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'error while testing model', err }, { status: 500 });
  }
}
