import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import dbConnect from '@/lib/db' 
import mongoose from 'mongoose'
import { auth } from '@clerk/nextjs/server'

// to update a specific raw prompt
export async function PATCH(
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

    const { title, rawPrompt } = await req.json()
    if(!title && !rawPrompt){
      return NextResponse.json(
        { message: 'atleast title or prompt required' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId },
      {
        $set: {
          ...(title && {title}),
          ...(rawPrompt && {rawPrompt})
        }
      },
      { new: true }
    )

    if(!updatedPrompt) {
      return NextResponse.json(
        { message: 'prompt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'prompt updated successfully', updatedPrompt},
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error updating prompt' },
      { status: 500 }
    )
  }
}

// to delete a specific raw prompt
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
    return NextResponse.json(
      { message: 'error deleting prompt' },
      { status: 500 }
    )
  }
}