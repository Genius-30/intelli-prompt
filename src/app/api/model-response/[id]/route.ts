import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db' 
import { Prompt } from '@/models/prompt.model'
import { auth } from '@clerk/nextjs/server'
import mongoose from 'mongoose'

// adds a model response to specific rawPrompt
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
){
  try {
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    await dbConnect()

    const promptId = params.id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: 'invalid promptId' },
        { status: 400 }
      )
    }

    const { model, response } = await req.json()
    if(!model || !response){
      return NextResponse.json(
        { message: 'missing model or response' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId },
      {
        $push: {
          modelResponses: { model, response }
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
      { message: 'response added in prompt', updatedPrompt },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error updating modelResponse' },
      { status: 500 }
    )
  }
}

// updates a specific model response
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
){
  try {
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    await dbConnect()

    const promptId = params.id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: 'invalid promptId' },
        { status: 400 }
      )
    }

    const { responseId, response } = await req.json()
    if(!responseId) {
      return NextResponse.json(
        { message: 'invalid responseId' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId, 'modelResponses._id': responseId },
      {
        $set: {
          'modelResponses.$.response': response
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
      { message: 'response added in prompt', updatedPrompt },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error updating modelResponse' },
      { status: 500 }
    )
  }
}

// deletes a specific model response
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
){
  try {
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    await dbConnect()

    const promptId = params.id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: 'invalid promptId' },
        { status: 400 }
      )
    }

    const responseId = await req.json()
    if(!responseId) {
      return NextResponse.json(
        { message: 'invalid responseId' },
        { status: 400 }
      )
    }

    await Prompt.findOneAndUpdate(
      { _id: promptId, owner: userId },
      {
        $pull: {
          modelResponses: { _id: new mongoose.Types.ObjectId(responseId) }
        }
      },
      { new: true }
    )
    
    return NextResponse.json(
      { message: 'response deleted in prompt' },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error deleting modelResponse' },
      { status: 500 }
    )
  }
}