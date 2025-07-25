import { NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";
import { ModelResponse } from "@/models/modelResponse.model";
import { Version } from "@/models/version.model";

// Delete version
export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const versionId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(versionId)) {
      return NextResponse.json({ message: "invalid versionId" },{ status: 400 });
    }

    const version = await Version.findOneAndDelete({
      _id: versionId,
      ownerId: userId,
    });
    if (!version) {
      return NextResponse.json({ message: "couldn't delete version" }, { status: 400 });
    }

    await ModelResponse.deleteMany({ versionId, ownerId: userId });

    const prompt = await Prompt.findOneAndUpdate(
      { _id: version.promptId, ownerId: userId },
      {
        $inc: { totalVersions: -1 },
      },
      { new: true }
    );
    if (prompt && prompt.totalVersions <= 0) {
      await Prompt.deleteOne({ _id: prompt._id, ownerId: userId });
    }

    return NextResponse.json({ message: "version deleted" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err deleting version" }, { status: 500 });
  }
}

// fetch specific version
export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const versionId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(versionId)) {
      return NextResponse.json({ message: "invalid versionId" }, { status: 400 });
    }

    const version = await Version.findById({ _id: versionId }).lean();
    if(!version){
      return NextResponse.json({ message: "version not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "version fetched", version }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err fetching prompt" }, { status: 500 });
  }
}