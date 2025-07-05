import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// fetch all prompts of specific folder
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { folderId } = await req.json()

    const prompts = await Prompt.find({ folderId })
    if(!prompts){
      return NextResponse.json(
        { message: 'no prompts found' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'all prompts fetched', prompts },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error fetching all prompts' },
      { status: 500 }
    )
  }
}