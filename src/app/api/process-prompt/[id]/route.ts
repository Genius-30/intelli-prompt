import { NextRequest, NextResponse } from 'next/server';
import { enhancedPrompt } from '@/utils/enhancePrompt';
import { testPromptOnModels } from '@/utils/testModels';
import { Prompt as rawPrompt } from '@/models/prompt.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

// ai processing and linking everything together
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const { provider, model } = await req.json()
    const promptId = (await params).id

    const rawPromptDoc = await rawPrompt.findById({ _id: promptId })
    if(!rawPromptDoc){
      return NextResponse.json(
        { message: 'Prompt not found' },
        { status: 404 }
      )
    }

    const rawText = rawPromptDoc.rawPrompt

    const enhancedContent = await enhancedPrompt(rawText) // discuss

    const modelResponse = await testPromptOnModels({ provider, model, prompt: enhancedContent || ''})

    rawPromptDoc.enhancedPrompts.push({ version: model, content: enhancedContent || ''})

    rawPromptDoc.modelResponses.push({ model, response: modelResponse || ''})

    await rawPromptDoc.save()

    return NextResponse.json(
      { message: 'processed successfully', rawPromptDoc },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error while processing' },
      { status: 500 }
    );
  }
}