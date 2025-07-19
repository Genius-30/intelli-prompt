import { NextResponse } from "next/server";
import { Version } from "@/models/version.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"
import { Prompt } from "@/models/prompt.model";

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
      return NextResponse.json({ error: "missing required feild" },{ status: 400 });
    }

    const existingVersion = await Version.findOne({
      _id: versionId,
      ownerId: userId,
    })
    if (!existingVersion) {
      return NextResponse.json({ error: "version not found" }, { status: 404 });
    }
    
    existingVersion.isActive = false
    await existingVersion.save()

    const newVersion = await Version.create({
      ownerId: userId,
      promptId: existingVersion.promptId,
      content: content || existingVersion.content,
      isActive: true,
      isFavorite: false
    })

    await Prompt.updateOne(
      { _id: existingVersion.promptId, ownerId: userId },
      {
        $inc: { totalVersions: 1 },
      }
    )

    return NextResponse.json({ message: "New version created", newVersion }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add to history" }, { status: 500 });
  }
}
