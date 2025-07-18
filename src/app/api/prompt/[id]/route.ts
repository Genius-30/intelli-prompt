import { NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";
import { ModelResponse } from "@/models/modelResponse.model";

// updates prompt title
export async function PATCH(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const promptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: "invalid promptId" }, { status: 400 });
    }

    const { newTitle } = await req.json();
    if (!newTitle) {
      return NextResponse.json({ message: "invalid title" }, { status: 400 });
    }

    await Prompt.updateOne(
      { _id: promptId, ownerId: userId },
      { title: newTitle }
    );

    return NextResponse.json({ message: "prompt renamed" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "error renaming prompt" }, { status: 500 });
  }
}

// delete specific prompt
export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const promptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: "invalid promptId" },{ status: 400 });
    }

    const prompt = await Prompt.findOneAndDelete({
      _id: promptId,
      ownerId: userId,
    });
    if (!prompt) {
      return NextResponse.json({ message: "couldn't delete prompt" }, { status: 400 });
    }

    await ModelResponse.deleteMany({ promptId: promptId, ownerId: userId });

    return NextResponse.json({ message: "prompt deleted" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err deleting prompt" }, { status: 500 });
  }
}

// fetch specific prompt
export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const promptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: "invalid promptId" }, { status: 400 });
    }

    const prompt = await Prompt.findById({ _id: promptId }).lean();

    return NextResponse.json({ message: "prompt fetched", prompt }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err fetching prompt" }, { status: 500 });
  }
}