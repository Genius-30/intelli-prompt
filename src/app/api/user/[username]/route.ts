import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const username = await params.username;
    if (!username)
      return NextResponse.json(
        { message: "Username required" },
        { status: 400 }
      );

    const user = await User.findOne({ username })
      .select(
        "username fullname bio email avatar rank followerCount followeeCount createdAt"
      )
      .lean();
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(
      { message: "user details fetched.", user },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching user details" },
      { status: 500 }
    );
  }
}
