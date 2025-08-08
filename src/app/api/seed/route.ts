import { NextResponse } from "next/server";
import connectDb from '@/lib/db' 
import mongoose from "mongoose";
import { Folder } from "@/models/folder.model";
import { Prompt } from "@/models/prompt.model";
import { Version } from "@/models/version.model";
import { ModelResponse } from "@/models/modelResponse.model";
import { SharedPrompt } from "@/models/sharedPrompt.model";

const TUTORIAL_FOLDER_ID = new mongoose.Types.ObjectId("6882f28409b30abc32e77c46");

export async function GET() {
  try {
    await connectDb()

    const folder = await Folder.findById(TUTORIAL_FOLDER_ID).lean();

    const prompts = await Prompt.find({ folderId: TUTORIAL_FOLDER_ID }).lean();

    const promptsWithVersions = await Promise.all(
      prompts.map(async (prompt) => {
        const versions = await Version.find({ promptId: prompt._id }).lean();

        const versionsWithResponses = await Promise.all(
          versions.map(async (version) => {
            const modelResponses = await ModelResponse.find({ versionId: version._id }).lean();
            return { ...version, modelResponses };
          })
        );

        return { ...prompt, versions: versionsWithResponses };
      })
    );

    const sharedPrompts = await SharedPrompt.find({ ownerId: "0000000000000000" }).lean();

    return NextResponse.json({ folder, prompts: promptsWithVersions, sharedPrompts }, { status: 200 });
  } catch (error) {
    console.error("[TUTORIAL_FETCH_ERROR]", error);
    return NextResponse.json({ message: "Failed to fetch tutorial data" }, { status: 500 });
  }
}