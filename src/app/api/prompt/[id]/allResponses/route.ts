import { NextRequest, NextResponse } from "next/server";
import { ModelResponse } from "@/models/modelResponse.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

export async function GET(
  req: NextRequest, 
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: 'invalid promptId' },{ status: 400 })
    }

    const responses = await ModelResponse.find({ promptId, ownerId: userId }).sort({ createdAt: -1 })

    if(!responses) return NextResponse.json({message:'no response found'},{status:404})

    return NextResponse.json({ message: "enhanced", responses}, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err while fetching all responses" }, { status: 500 });
  }
}
