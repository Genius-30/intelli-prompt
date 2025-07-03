import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

export async function PATCH(
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
    
    const prompt = await Prompt.findOne({ _id: promptId, ownerId: userId });
    if(!prompt){
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    prompt.isFavorite = !prompt.isFavorite
    await prompt.save()

    return NextResponse.json({ message: "favorite toggeled", }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err toggeling favorite" }, { status: 500 });
  }
}
