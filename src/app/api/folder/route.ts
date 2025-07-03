import { NextRequest, NextResponse } from 'next/server'
import { Folder } from '@/models/folder.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// create new folder
export async function POST(req: NextRequest) {
  try {
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const { name } = await req.json()
    if(!name){
      return NextResponse.json(
        { message: 'name is required' },
        { status: 400 }
      )
    }

    const folder = await Folder.create({
      name,
      owner: mongoUser._id
    })

    return NextResponse.json(
      { message: 'folder created successfully', folder },
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
    const { mongoUser, error } = await getAuthenticatedUser()
    if(error) return error

    const folders = await Folder.find({ owner: mongoUser._id }).sort({ createdAt: -1 })

    return NextResponse.json(
      { message: 'folders fetched successfully', folders },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'error fetching folders' },
      { status: 500 }
    )
  }
}