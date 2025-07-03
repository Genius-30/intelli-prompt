import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// to add a new prompt
export async function POST(req: NextRequest) {
  try {    
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const { title, rawPrompt } = await req.json()
    if(!title || !rawPrompt){
      return NextResponse.json(
        { message: 'title or prompt isnt there' },
        { status: 400 }
      )
    }

    const prompt = await Prompt.create({
      owner: mongoUser._id, 
      title,
      rawPrompt
    })

    return NextResponse.json(
      { message: 'prompt created successfully', prompt },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error creating prompt' },
      { status: 500 }
    )
  }
}