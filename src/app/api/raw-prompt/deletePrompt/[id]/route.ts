import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import dbConnect from '@/lib/db' 
import mongoose from 'mongoose'
import { auth } from '@clerk/nextjs/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
){
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

    await Prompt.findByIdAndDelete(promptId)

    return NextResponse.json(
      { message: 'prompt deleted successfully', prompt },
      { status: 200 }
    ) 
  } catch (err) {
    console.error('error deleting prompt: ',err)
    return NextResponse.json(
      { message: 'error deleting prompt' },
      { status: 500 }
    )
  }
}