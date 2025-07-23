import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";
import { Version } from "@/models/version.model";


// get active version
export async function GET(
  req: Request, 
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: 'invalid PromptId' },{ status: 400 })
    }

    const activeVersion = await Version.findOne(
      { promptId, ownerId: userId, isActive: true }
    )

    return NextResponse.json({ message: "Active version fetched", activeVersion }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "error toggeling isActive" }, { status: 500 });
  }
}