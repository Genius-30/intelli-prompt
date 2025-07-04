import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { User } from '@/models/user.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'

export async function POST( req: NextRequest ) {
  try {
    const { userId } = await auth()
    if(!userId){
      return NextResponse.json(
        { message: 'Unauthorized Request' },
        { status: 401 }
      )
    }

    await dbConnect()

    const clerkUser = await clerkClient.users.getUser(userId)

    const newUser = await User.create({
      _id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`
    })

    return NextResponse.json(
      { message: 'MongoUser created', newUser },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'err creating user '},
      { status: 500 }
    )
  }
}

export async function GET( req: NextRequest ) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error
    
    const mongoUser = await User.findById({ _id: userId })
    
    return NextResponse.json(
      { message: 'user details fetched', mongoUser },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'err fetching user details'},
      { status: 500 }
    )
  }
}