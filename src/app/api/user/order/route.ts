import Razorpay from "razorpay"
import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if (error) return error
    
    const { plan, currency } = await req.json()
    if(plan !== 'Premium' && plan !== 'Enterprise') {
      return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 })
    }

    const order = await razorpay.orders.create({
      amount: plan === 'Premium' ? 999 : 9999, 
      currency,
      receipt: `receipt_${Date.now()}_${userId}`,
    })
    if (!order) {
      return NextResponse.json({ message: 'Could not create order' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Order created ', order }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Couldnt Order', err }, { status: 500 })
  }
}