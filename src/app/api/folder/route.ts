import { NextRequest, NextResponse } from 'next/server'
import { Folder } from '@/models/folder.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// create new folder
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { title } = await req.json()
    if(!title){
      return NextResponse.json(
        { message: 'title is required' },
        { status: 400 }
      )
    }

    const folder = await Folder.create({
      title,
      ownerId: userId
    })

    return NextResponse.json(
      { message: 'folder created', folder },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error creating folder' },
      { status: 500 }
    )
  }
}

// Fetch all folders for user
export async function GET(req: NextRequest){
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const folders = await Folder.find({ ownerId: userId }).sort({ createdAt: -1 })

    return NextResponse.json(
      { message: 'folders fetched', folders },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error fetching folders' },
      { status: 500 }
    )
  }
}