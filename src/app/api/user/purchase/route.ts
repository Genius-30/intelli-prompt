import { NextResponse } from 'next/server'
import { User } from '@/models/user.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { Subscription } from '@/models/subscription.model'

export async function POST( req: Request ) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { paymentId, amount, currency, plan } = await req.json()
    
    const user = await User.findById({ _id: userId })
    if (!user) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 })
    }

    // Set subscriptionEnds and tokenLimit based on plan
    if (plan === 'Premium') {
      user.subscriptionEnds = new Date(new Date().setMonth(new Date().getMonth() + 6))
      user.tokenLimit = 100000
    } else if (plan === 'Enterprise') {
      user.subscriptionEnds = new Date(new Date().setMonth(new Date().getMonth() + 12))
      user.tokenLimit = 10000000
    } else {
      user.subscriptionEnds = new Date(new Date().setMonth(new Date().getMonth() + 12))
      user.tokenLimit = 1000
    }

    user.plan = plan
    user.tokensUsed = 0

    await user.save()

    await Subscription.create({
      ownerId: userId,
      paymentId,
      amount,
      currency,
      plan,
      subscriptionStart: new Date(),
      subscriptionEnds: user.subscriptionEnds
    })

    return NextResponse.json({ message: 'subscription recharged' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'err creating user ', err}, { status: 500 })
  }
}