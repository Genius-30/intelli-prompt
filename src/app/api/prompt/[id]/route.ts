import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";
import { Folder } from '@/models/folder.model'

export async function DELETE(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const promptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: "invalid promptId" },
        { status: 400 }
      );
    }

    const prompt = await Prompt.findOneAndDelete({ _id: promptId, ownerId: userId });
    if(!prompt){
      return NextResponse.json(
        { message: "couldn't delete" },
        { status: 400 }
      );
    }

    await Folder.updateOne(
      { _id: prompt.folderId, ownerId: userId },
      {
        $inc: { totalVersions: -1 },
      }
    )

    return NextResponse.json({ message: "prompt deleted" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err deleting prompt" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: any }

) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const promptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: "invalid promptId" },
        { status: 400 }
      );
    }

    const prompt = await Prompt.findById({ _id: promptId });

    return NextResponse.json(
      { message: "prompt fetched", prompt },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: "err fetching prompt" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { folderId } = await req.json()
    if(!folderId){
      return NextResponse.json(
        { message: "require folderId" },
        { status: 400 }
      )
    }

    const promptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: "invalid promptId" },
        { status: 400 }
      )
    }

    await Prompt.updateMany(
      { ownerId: userId, folderId: folderId },
      {
        $set: { isCurrent: false }
      }
    )
    await Prompt.updateOne(
      { _id: promptId, ownerId: userId },
      {
        $set: { isCurrent: true }
      }
    )

    return NextResponse.json(
      { message: "prompt isCurrent changed" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: "err fetching prompt" }, { status: 500 });
  }
}