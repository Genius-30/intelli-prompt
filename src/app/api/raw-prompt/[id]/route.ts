import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import mongoose from 'mongoose'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// to update a specific raw prompt
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
){
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

    const { title, rawPrompt } = await req.json()
    if(!title && !rawPrompt){
      return NextResponse.json(
        { message: 'atleast title or prompt required' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: mongoUser._id },
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
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: 'invalid promptId' },
        { status: 400 }
      )
    }

    await Prompt.findByIdAndDelete(promptId)

    return NextResponse.json(
      { message: 'prompt deleted successfully' },
      { status: 200 }
    ) 
  } catch (err) {
    return NextResponse.json(
      { message: 'error deleting prompt' },
      { status: 500 }
    )
  }
}