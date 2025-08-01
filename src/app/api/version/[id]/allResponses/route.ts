import { ModelResponse } from "@/models/modelResponse.model";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const versionId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(versionId)) {
      return NextResponse.json({ message: "invalid versionId" }, { status: 400 });
    }

    const responses = await ModelResponse.find({ versionId, ownerId: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (!responses) {
      return NextResponse.json({ message: "no response found" }, { status: 404 });
    }

    return NextResponse.json({ message: "allResponses fetched", responses }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err while fetching all responses" }, { status: 500 });
  }
}
