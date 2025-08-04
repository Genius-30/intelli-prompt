import { NextRequest, NextResponse } from "next/server";
import { ModelResponse } from '@/models/modelResponse.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

// deletes modelResponse
export async function DELETE(
  req: NextRequest, 
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error
    
    const { confirm } = await req.json();
    if (!confirm) {
      return NextResponse.json({ message: "not confirmed" }, { status: 400 });
    }

    const responseId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(responseId)) {
      return NextResponse.json({ message: 'invalid modelResponseId' },{ status: 400 })
    }

    await ModelResponse.findOneAndDelete({ _id: responseId, ownerId: userId })

    return NextResponse.json({ message: "modelResponse deleted", }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "err deleting modelResponse" }, { status: 500 });
  }
}