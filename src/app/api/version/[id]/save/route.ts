import { NextResponse } from "next/server"
import { Version } from "@/models/version.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

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

    const { content } = await req.json();
    if (!content){
      return NextResponse.json({ error: "missing required feilds" }, { status: 400 })
    }

    const updatedVersion = await Version.findOneAndUpdate(
      { _id: versionId, ownerId: userId },
      {
        $set: {
          content,
          isActive: true
        }
      },
      { new: true}
    )
    if (!updatedVersion) {
      return NextResponse.json({ error: "version not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "version saved", updatedVersion }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'err while saving' }, { status: 500 });
  }
}