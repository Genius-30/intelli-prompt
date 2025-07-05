import { NextRequest, NextResponse } from "next/server";
import { Folder } from "@/models/folder.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

export async function PATCH(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const folderId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ message: 'invalid folderId' },{ status: 400 })
    }
    
    const folder = await Folder.findOne({ _id: folderId, ownerId: userId });
    if(!folder){
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    folder.isFavorite = !folder.isFavorite
    await folder.save()

    return NextResponse.json({ message: "favorite toggeled", }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err toggeling favorite" }, { status: 500 });
  }
}
