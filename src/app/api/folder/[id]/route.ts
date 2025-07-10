import { NextRequest, NextResponse } from 'next/server'
import { Folder } from '@/models/folder.model'
import mongoose from 'mongoose'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { Prompt } from '@/models/prompt.model'

// renames folder
export async function PATCH(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const folderId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json(
        { message: 'invalid folderId' },
        { status: 400 }
      )
    }
    
    const { newTitle } = await req.json()
    if(!newTitle) {
      return NextResponse.json(
        { message: 'invalid title' },
        { status: 400 }
      )
    }

    await Folder.updateOne(
      { _id: folderId, ownerId: userId },
      { title: newTitle }
    )

    return NextResponse.json(
      { message: 'folder renamed' },
      { status: 200 }
    ) 
  } catch (err) {
    return NextResponse.json(
      { message: 'error renaming folder' },
      { status: 500 }
    )
  }
}

// delete folder along with prompts
export async function DELETE(
  req: NextRequest,
  { params }: { params: any }

) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const folderId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json(
        { message: 'invalid folderId' },
        { status: 400 }
      )
    }

    await Folder.findByIdAndDelete({ _id: folderId })

    await Prompt.deleteMany({ folderId })
    
    return NextResponse.json(
      { message: 'folder deleted' },
      { status: 200 }
    ) 
  } catch (err) {
    return NextResponse.json(
      { message: 'error deleting folder' },
      { status: 500 }
    )
  }
}

// to fetch a specific folder
export async function GET(
  req: NextRequest,
  { params }: { params: any }

) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const folderId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ message: 'invalid folderId' }, { status: 400 })
    }
    const folder = await Folder.findById({ _id: folderId })
    if(!folder) {
      return NextResponse.json({ message: 'folder not found!' }, { status: 404 })
    }

    return NextResponse.json({ message: 'folder found', folder }, { status: 200 }) 
  } catch (err) {
    return NextResponse.json({ message: 'err fetching folder' }, { status: 500 })
  }
}