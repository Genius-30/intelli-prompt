import { NextResponse } from 'next/server'
import { User } from '@/models/user.model'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/db' 

export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth()
    if(!userId){
      return {
        mongoUser: null,
        error: NextResponse.json(
          { message: 'Unauthorized Request' },
          { status: 401 }
        )
      }
    }

    await dbConnect()

    const mongoUser = await User.findOne({ clerkId: userId })
    if(!mongoUser){
      return {
        mongoUser: null,
        error: NextResponse.json(
          { message: 'user not found for this ClerkId' },
          { status: 404 }
        )
      }
    }

    return { mongoUser, error: null }
  } catch (err) {
    return {
      mongoUser: null,
      error: NextResponse.json(
        { message: 'error while authentication' },
        { status: 500 }
      )
    }
  }
}