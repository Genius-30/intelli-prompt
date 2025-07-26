import { NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { Version } from "@/models/version.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

// fetch all prompts of specific folder
export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const folderId = (await params).id;

    const prompts = await Prompt.find({ folderId }).lean();
    if (!prompts || prompts.length === 0) {
      return NextResponse.json(
        { message: "no prompts found", prompts: [] },
        { status: 200 }
      );
    }

    const promptsWithActiveVersion = await Promise.all(
      prompts.map(async (prompt) => {
        const activeVersion = await Version.findOne({
          promptId: prompt._id,
          isActive: true,
        }).lean();
        return {
          ...prompt,
          activeVersion,
        };
      })
    );

    return NextResponse.json(
      { message: "all prompts fetched", prompts: promptsWithActiveVersion },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "error fetching all prompts" },
      { status: 500 }
    );
  }
}
