import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { Version } from '@/models/version.model'
import mongoose from 'mongoose'

// Get all versions of a prompt
export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id;
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json({ message: 'invalid promptId' },{ status: 400 })
    }

    const versions = await Version.find({ promptId, ownerId: userId }).sort({ createdAt: -1 }).lean();
    if(!versions) {
      return NextResponse.json({ message: 'no versions found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'versions fetched', versions }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "error fetching versions" }, { status: 500 });
  }
}