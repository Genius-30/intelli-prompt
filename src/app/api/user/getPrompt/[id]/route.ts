import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import mongoose from "mongoose";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

// to get a specific prompts of a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: 'invalid promptId' },
        { status: 400 }
      )
    }

    const prompt = await Prompt.findById(promptId).populate('owner')
    if(!prompt){
      return NextResponse.json(
        { message: 'prompt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'prompt fetched successfully', prompt },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error fetching prompt' },
      { status: 500 }
    )
  }
}