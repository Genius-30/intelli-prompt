import { NextResponse } from 'next/server'
import { Prompt } from '@/models/prompt.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

// fetch all prompts of specific folder
export async function GET(
  req: Request, 
  {params}: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const folderId = (await params).id;

    const prompts = await Prompt.find({ folderId }).lean();
    if(!prompts){
      return NextResponse.json({ message: 'no prompts found' }, { status: 500 })
    }

    return NextResponse.json({ message: 'all prompts fetched', prompts }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'error fetching all prompts' }, { status: 500 });
  }
}