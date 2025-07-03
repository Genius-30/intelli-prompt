import { NextRequest, NextResponse } from 'next/server';
import { testPromptOnModels } from '@/utils/testModels';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { ModelResponse } from '@/models/modelResponse.model'
import { Prompt } from '@/models/prompt.model'

// tests prompt on models
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { prompt,  models } = await req.json();
    if (!prompt || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json({ error: 'Prompt and models are required.' }, { status: 400 });
    }

    const promptDoc = await Prompt.findOne({ content: prompt.trim(), ownerId: userId });
    if (!promptDoc) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    const results = await Promise.all(
      models.map(async (modelOption) => {
        const result = await testPromptOnModels({ ...modelOption, prompt });

        await ModelResponse.create({
          promptId: promptDoc._id,
          ownerId: userId,
          model: modelOption.model,
          temperature: modelOption.temperature,
          response: result,
          isFavorite: false
        });

        return {
          ...modelOption,
          response: result
        };
      })
    );

    return NextResponse.json({ message:'testing completed', results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'error while testing model', err }, { status: 500 });
  }
}
