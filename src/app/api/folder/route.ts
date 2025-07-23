import { NextRequest, NextResponse } from "next/server";

import { Folder } from "@/models/folder.model";
import { Prompt } from "@/models/prompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { rateLimit } from "@/lib/rateLimit";

// create new folder
export async function POST(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { title } = await req.json();
    if (!title) {
      return NextResponse.json(
        { message: "title is required" },
        { status: 400 }
      );
    }

    await Folder.create({
      title,
      ownerId: userId,
    });

    return NextResponse.json({ message: "folder created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "error creating folder" },
      { status: 500 }
    );
  }
}

// Fetch all folders for user
export async function GET(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const folders = await Folder.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch promptCount for each folder in parallel
    const foldersWithPromptCount = await Promise.all(
      folders.map(async (folder) => {
        const count = await Prompt.countDocuments({ folderId: folder._id });
        return {
          ...folder,
          promptCount: count,
        };
      })
    );

    return NextResponse.json(
      { message: "folders fetched", folders: foldersWithPromptCount },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "error fetching folders" },
      { status: 500 }
    );
  }
}
