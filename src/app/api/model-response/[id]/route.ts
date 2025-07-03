import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import mongoose from 'mongoose'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// adds a model response to specific rawPrompt
export async function POST(
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

    const { model, response } = await req.json()
    if(!model || !response){
      return NextResponse.json(
        { message: 'missing model or response' },
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, owner: mongoUser._id },
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
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
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
      { _id: promptId, owner: mongoUser._id, 'modelResponses._id': responseId },
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
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
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
      { _id: promptId, owner: mongoUser._id },
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