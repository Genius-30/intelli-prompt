import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error
  
    const user = await User.findById({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.newsletter = !user.newsletter;
    await user.save();
  
    return NextResponse.json({ message: `Newsletter ${user.newsletter ? "subscribed" : "unsubscribed"}` });
  } catch (err) {
    return NextResponse.json({ error: "Error toggling newsletter subscription",  err }, { status: 500 });
  }
}
