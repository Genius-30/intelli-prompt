import { NextRequest, NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    await Prompt.findOneAndDelete({ _id: promptId, ownerId: userId });

    return NextResponse.json({ message: "prompt deleted" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err deleting prompt" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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
      { message: "prompt fetchec", prompt },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: "err fetching prompt" }, { status: 500 });
  }
}
