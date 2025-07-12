import Razorpay from "razorpay"
import { NextResponse } from "next/server"

type RazorpayOrderCreateRequestBody = {
  amount: number
  currency: string
  receipt: string
  payment_capture?: 0 | 1
  notes?: Record<string, string>
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST() {
  const options: RazorpayOrderCreateRequestBody = {
    amount: 50000, // Amount in paisa = ₹500
    currency: "INR",
    receipt: "order_rcptid_11",
  }

  try {
    const order = await razorpay.orders.create(options)
    return NextResponse.json(order)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}