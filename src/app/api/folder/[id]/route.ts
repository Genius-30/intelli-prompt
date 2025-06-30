import { NextRequest, NextResponse } from 'next/server'
import { Folder } from '@/models/folder.model'
import dbConnect from '@/lib/db' 
import mongoose from 'mongoose'
import { auth } from '@clerk/nextjs/server'

// delete folder along with prompts
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }
    
    await dbConnect()

    const folderId = params.id
    if(!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json(
        { message: 'invalid folderId' },
        { status: 400 }
      )
    }

    await Folder.findByIdAndDelete(folderId)

    return NextResponse.json(
      { message: 'folder deleted successfully' },
      { status: 200 }
    ) 
  } catch (err) {
    return NextResponse.json(
      { message: 'error deleting folder' },
      { status: 500 }
    )
  }
}