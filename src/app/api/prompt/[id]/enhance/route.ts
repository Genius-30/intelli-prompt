import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"
import { enhancedPrompt } from '@/utils/enhancePrompt'

export async function POST(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: 'invalid promptId' },{ status: 400 })
    }

    const prompt = await Prompt.findOne({ _id: promptId })
    if(!prompt) return NextResponse.json({message:'prompt not found'},{status:404})

    const enhanced = await enhancedPrompt(prompt.content)

    return NextResponse.json({ message: "enhanced", enhanced}, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err while enhancing" }, { status: 500 });
  }
}
