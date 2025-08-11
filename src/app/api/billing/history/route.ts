import { NextResponse } from "next/server";
import { Subscription } from "@/models/subscription.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function GET() {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const history = await Subscription.find({ ownerId: userId })
      .sort({ subscriptionStart: -1 })
      .lean();

    const formatted = history.map((sub) => ({
      plan: sub.plan,
      amount: sub.amount,
      currency: sub.currency,
      paymentId: sub.paymentId,
      subscriptionStart: sub.subscriptionStart,
      subscriptionEnds: sub.subscriptionEnds,
      createdAt: sub.createdAt,
    }));

    return NextResponse.json(
      { message: "Billing history fetched successfully", history: formatted },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Error fetching billing history", err }, { status: 500 });
  }
}
