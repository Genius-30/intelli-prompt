import { NextResponse } from 'next/server'
import { User } from '@/models/user.model'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { Subscription } from '@/models/subscription.model'
import crypto from 'crypto'

export async function POST( req: Request ) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, currency } = await req.json()
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan || !currency) {
      return NextResponse.json({ message: "Missing payment details" }, { status: 400 });
    }

    // verification of payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
    }

    const user = await User.findById({ _id: userId })
    if (!user) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 })
    }

    // Set subscriptionEnds and tokenLimit based on plan
    if (plan === 'Premium') {
      user.subscriptionEnds = new Date(new Date().setMonth(new Date().getMonth() + 6))
      user.tokenLimit = 5000000
    } else if (plan === 'Enterprise') {
      user.subscriptionEnds = new Date(new Date().setMonth(new Date().getMonth() + 12))
      user.tokenLimit = 25000000
    } else {
      user.subscriptionEnds = new Date(new Date().setMonth(new Date().getMonth() + 12))
      user.tokenLimit = 100000
    }

    user.plan = plan
    user.tokensUsed = 0

    await user.save()

    await Subscription.create({
      ownerId: userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: plan === 'Premium' ? 999 : 9999,
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