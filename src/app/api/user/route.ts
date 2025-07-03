import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/clerk-sdk-node'
import dbConnect from '@/lib/db'
import { User } from '@/models/user.model'

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

    const mongoUser = await User.findOne({ clerkId: userId })
    if(mongoUser){
      return NextResponse.json(
        { message: 'user already exists' },
        { status: 200 }
      )
    }

    const clerkUser = await clerkClient.users.getUser(userId)

    const newUser = await User.create({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      username: clerkUser.username
    })

    return NextResponse.json(
      { message: 'Mongo user created', newUser },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: 'err creating user '},
      { status: 500 }
    )
  }
}