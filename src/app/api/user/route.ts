import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

// get public user profile
export async function GET(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const mongoUser = await User.findById({ _id: userId }).lean();
    if (!mongoUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user details fetched", mongoUser }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "err fetching user details" }, { status: 500 });
  }
}
