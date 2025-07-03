import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/db' 

export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth()
    if(!userId){
      return {
        userId: null,
        error: NextResponse.json(
          { message: 'Unauthorized Request' },
          { status: 401 }
        )
      }
    }

    await dbConnect()

    return { userId, error: null }
  } catch (err) {
    return {
      userId: null,
      error: NextResponse.json(
        { message: 'error while authentication' },
        { status: 500 }
      )
    }
  }
}