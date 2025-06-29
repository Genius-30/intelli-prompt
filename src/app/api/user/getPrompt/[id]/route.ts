import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import dbConnect from '@/lib/db'
import mongoose from "mongoose";
import { auth } from '@clerk/nextjs/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    const promptId = params.id
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
    console.error('error fetching prompt: ',err)
    return NextResponse.json(
      { message: 'error fetching prompt' },
      { status: 500 }
    )
  }
}