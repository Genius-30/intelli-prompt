import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function GET(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const mongoUser = await User.findById({ _id: userId });

    return NextResponse.json(
      { message: "user details fetched", mongoUser },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "err fetching user details" },
      { status: 500 }
    );
  }
}
