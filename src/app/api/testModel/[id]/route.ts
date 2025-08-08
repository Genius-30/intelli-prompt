import { NextRequest, NextResponse } from "next/server";
import { ModelResponse } from "@/models/modelResponse.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

// deletes modelResponse
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const modelResponseId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(modelResponseId)) {
      return NextResponse.json({ message: "invalid modelResponseId" }, { status: 400 });
    }

    await ModelResponse.findOneAndDelete({ _id: modelResponseId, ownerId: userId });

    return NextResponse.json({ message: "modelResponse deleted" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err fetching modelResponse" }, { status: 500 });
  }
}

// get specific modelResponse
export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const modelResponseId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(modelResponseId)) {
      return NextResponse.json({ message: "invalid modelResponseId" }, { status: 400 });
    }

    const modelResponse = await ModelResponse.findById({ _id: modelResponseId });
    if (!modelResponse) {
      return NextResponse.json({ message: "modelResponse not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "modelResponse found", modelResponse }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "err fetching modelResponse" }, { status: 500 });
  }
}
