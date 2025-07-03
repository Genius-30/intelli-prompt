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
    
    const { title,content } = await req.json();
    if (!title && !content){
      return NextResponse.json({ error: "missing required feild" },{ status: 400 });
    }

    const existingPrompt = await Prompt.findOne({
      _id: promptId,
      ownerId: userId,
    })

    if (!existingPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    existingPrompt.isCurrent = false
    await existingPrompt.save()

    const newPrompt = await Prompt.create({
      ownerId: userId,
      folderId: existingPrompt.folderId,
      title: title || existingPrompt.title,
      content: content || existingPrompt.content,
      version: existingPrompt.version + 1,
      isCurrent: true,
      isFavorite: false
    });

    return NextResponse.json({ message: "New version created", newPrompt }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add to history" }, { status: 500 });
  }
}
