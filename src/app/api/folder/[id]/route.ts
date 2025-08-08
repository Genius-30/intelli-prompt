import { NextResponse } from "next/server";
import { Folder } from "@/models/folder.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { Prompt } from "@/models/prompt.model";
import { ModelResponse } from "@/models/modelResponse.model";
import { Version } from "@/models/version.model";
import mongoose from "mongoose";

// renames folder
export async function PATCH(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const folderId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ message: "invalid folderId" }, { status: 400 });
    }

    const { newTitle } = await req.json();
    if (!newTitle) {
      return NextResponse.json({ message: "invalid title" }, { status: 400 });
    }

    await Folder.updateOne(
      { _id: folderId, ownerId: userId },
      { title: newTitle }
    );

    return NextResponse.json({ message: "folder renamed" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "error renaming folder" }, { status: 500 });
  }
}

// delete folder along with prompts
export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const folderId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ message: "invalid folderId" }, { status: 400 });
    }

    const prompts = await Prompt.find({ folderId }, "_id");
    const promptIds = prompts.map((prompt) => prompt._id);

    await ModelResponse.deleteMany({ promptId: { $in: promptIds } });
    await Version.deleteMany({ promptId: { $in: promptIds } });
    await Prompt.deleteMany({ folderId });
    await Folder.findByIdAndDelete({ _id: folderId });

    return NextResponse.json({ message: "folder deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "error deleting folder" }, { status: 500 });
  }
}

// to fetch a specific folder
export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const folderId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ message: "invalid folderId" }, { status: 400 });
    }
    const folder = await Folder.findById({ _id: folderId }).lean();
    if (!folder) {
      return NextResponse.json({ message: "folder not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "folder found", folder }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "err fetching folder" }, { status: 500 });
  }
}
