import { NextRequest, NextResponse } from "next/server";
import { ModelResponse } from '@/models/modelResponse.model'
import mongoose from "mongoose"
import connectDb from "@/lib/db";

// get specific modelResponse
export async function GET(
  req: NextRequest, 
  { params }: { params: any }
) {
  try {
    await connectDb();

    const modelResponseId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(modelResponseId)) {
      return NextResponse.json({ message: 'invalid modelResponseId' },{ status: 400 })
    }

    const modelResponse = await ModelResponse.findById({ _id: modelResponseId })
    if(!modelResponse) {
      return NextResponse.json({ message: 'modelResponse not found' },{ status: 404 })
    }

    return NextResponse.json({ message: "modelResponse found", modelResponse }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "err fetching modelResponse" }, { status: 500 });
  }
}