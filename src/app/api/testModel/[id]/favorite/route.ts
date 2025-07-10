import { NextRequest, NextResponse } from "next/server";
import { ModelResponse } from '@/models/modelResponse.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

export async function PATCH(
  req: NextRequest, 
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const modelResponseId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(modelResponseId)) {
      return NextResponse.json({ message: 'invalid modelResponseId' },{ status: 400 })
    }

    const response = await ModelResponse.findOne({ _id: modelResponseId, ownerId: userId })
    if(!response){
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    response.isFavorite = !response.isFavorite
    await response.save()

    return NextResponse.json({ message: "toggeled favorite", }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err toggeling favorite" }, { status: 500 });
  }
}
