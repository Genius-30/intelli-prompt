import { NextResponse } from "next/server";
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"
import { Version } from "@/models/version.model";

// Set a version as active
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
    
    const { promptId } = await req.json();
    if (!promptId){
      return NextResponse.json({ error: "missing required field" },{ status: 400 });
    }

    await Version.updateMany(
      { promptId, ownerId: userId },
      { 
        $set: { isActive: false }
      }
    )

    const version = await Version.findOne({ _id: versionId, ownerId: userId });
    if(!version){
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    version.isActive = !version.isActive
    await version.save()

    return NextResponse.json({ message: "isActive toggled", }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "error toggeling isActive" }, { status: 500 });
  }
}