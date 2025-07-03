import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// to get all the prompts of a specific user
export async function GET(req: NextRequest){
  try {
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error
    
    const prompts = await Prompt.find({ owner: mongoUser._id }).sort({ createdAt: -1 })

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