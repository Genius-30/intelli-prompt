import { NextRequest, NextResponse } from "next/server";

import { Prompt } from "@/models/prompt.model";
import { Version } from "@/models/version.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { rateLimit } from "@/lib/rateLimit";

// create new prompt
export async function POST(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { folderId, title, content } = await req.json();
    if (!title || !folderId || !content) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    const newPrompt = await Prompt.create({
      ownerId: userId,
      folderId: folderId,
      title,
      totalVersions: 1,
    });

    await Version.create({
      ownerId: userId,
      promptId: newPrompt._id,
      content,
      isActive: true,
      versionNumber: 1,
    });

    return NextResponse.json({ message: "prompt created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "error creating prompt" },
      { status: 500 }
    );
  }
}
