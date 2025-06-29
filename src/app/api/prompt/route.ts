import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db' 
import { Prompt } from '@/models/prompt.model'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    const { title, rawPrompt } = await req.json()
    if(!title || !rawPrompt){
      return NextResponse.json(
        { message: 'title or prompt isnt there' },
        { status: 400 }
      )
    }

    const prompt = await Prompt.create({
      owner: userId,
      title,
      rawPrompt
    })

    return NextResponse.json(
      { message: 'prompt created successfully', prompt },
      { status: 201 }
    )
  } catch (err) {
    console.error('error creating prompt: ',err)
    return NextResponse.json(
      { message: 'error creating prompt' },
      { status: 500 }
    )
  }
}