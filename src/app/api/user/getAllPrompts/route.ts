import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import dbConnect from '@/lib/db' 
import { auth } from '@clerk/nextjs/server'

// to get all the prompts of a specific user
export async function GET(req: NextRequest){
  try {
    await dbConnect()

    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    const prompts = await Prompt.find({ owner: userId }).sort({ createdAt: -1 })

    return NextResponse.json(
      { message: 'prompts fetched successfully', prompts },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error fetching prompts' },
      { status: 500 }
    )
  }
}