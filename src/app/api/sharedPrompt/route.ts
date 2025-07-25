import { NextRequest, NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import connectDb from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { getSetCache } from "@/lib/redisCache";
import { getAllSharedPrompts } from "@/lib/queries/sharedPrompt";

// create a sharedPrompt
export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { title, content, tags, modelUsed } = await req.json();
    if (!title || !content || !modelUsed) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSharedPrompt = await SharedPrompt.create({
      ownerId: userId,
      title,
      content,
      tags: tags || [],
      modelUsed,
    });

    return NextResponse.json(
      { message: "Prompt shared successfully", newSharedPrompt },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to share prompt" },
      { status: 500 }
    );
  }
}

// get all sharedPrompt
export async function GET(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    await connectDb();

    const data = await getSetCache("allSharedPrompts", 60, getAllSharedPrompts);

    return NextResponse.json(
      { message: "all sharedPrompt fetched", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed fetching all sharedPrompts" },
      { status: 500 }
    );
  }
}
