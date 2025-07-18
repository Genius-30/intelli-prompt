import { NextResponse } from "next/server";
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"
import { Version } from "@/models/version.model";

// Mark version as favorite
export async function PATCH(
  req: Request, 
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const versionId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(versionId)) {
      return NextResponse.json({ message: 'invalid versionId' },{ status: 400 })
    }

    const version = await Version.findOne({ _id: versionId, ownerId: userId });
    if(!version){
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    version.isFavorite = !version.isFavorite
    await version.save()

    return NextResponse.json({ message: "favorite toggeled", }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err toggeling favorite" }, { status: 500 });
  }
}
