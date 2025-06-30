import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db' 
import { Prompt } from '@/models/prompt.model'
import { auth } from '@clerk/nextjs/server'
import mongoose from 'mongoose'

// to add enhancedPrompt in a specific raw prompt
export async function POST(
  req: NextRequest,
  { params }: { params : { id : string } }
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

    const { version, content } = await req.json()
    if(!version || !content){
      return NextResponse.json(
        { message: 'missing version or content' },
        { status: 400 }
      )
    }

    const updatedPrompt = Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId },
      {
        $push: {
          enhancedPrompts: { version, content }
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
      { message: 'Enhanced prompt added', updatedPrompt },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error updating prompt' },
      { status: 500 }
    )
  }
}

// to update a specific enhancedPrompt in a specific raw prompt
export async function PATCH(
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

    const { enhancedId , content } = await req.json()
    if(!enhancedId  || !content){
      return NextResponse.json(
        { message: 'missing enhancedId or content' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId, 'enhancedPrompts._id': enhancedId },
      { 
        $set: {
          'enhancedPrompts.$.content': content
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
      { message: 'Enhanced prompt updated', updatedPrompt },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error updating prompt' },
      { status: 500 }
    )
  }
}

// to delete a specific enhancedPrompt in a specific raw prompt
export async function DELETE(
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

    const { enhancedId } = await req.json()
    if(!enhancedId){
      return NextResponse.json(
        { message: 'missing enhancedId' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId },
      {
        $pull: {
          enhancedPrompts: { _id: new mongoose.Types.ObjectId(enhancedId) }
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
      { message: 'Enhanced prompt deleted', updatedPrompt },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error deleting prompt' },
      { status: 500 }
    )
  }
}