import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db' 
import { Folder } from '@/models/folder.model'
import { auth } from '@clerk/nextjs/server'

// create new folder
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { name } = await req.json()
    if(!name){
      return NextResponse.json(
        { message: 'name is required' },
        { status: 400 }
      )
    }

    const folder = await Folder.create({
      name,
      owner: userId
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
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    await dbConnect()

    const folders = await Folder.find({ owner: userId }).sort({ createdAt: -1 })

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