import { NextRequest, NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { Folder } from '@/models/folder.model'

// create new prompt
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { content , folderId } = await req.json()
    if(!content || !folderId){
      return NextResponse.json(
        { message: 'missing required fields' },
        { status: 400 }
      )
    }

    const newPrompt = await Prompt.create({
      ownerId: userId, 
      folderId: folderId,
      content,
      version: 1,
      isCurrent: true,
      isFavorite: false
    })

    await Folder.findOneAndUpdate(
      { _id: folderId, ownerId: userId },
      {
        $inc: { totalVersions: 1 },
        $set: { activeVersion: newPrompt._id }
      },
      { new: false }
    )

    return NextResponse.json(
      { message: 'prompt created', newPrompt },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error creating prompt' },
      { status: 500 }
    )
  }
}