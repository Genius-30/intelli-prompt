import { NextResponse } from "next/server";
import { User } from "@/models/user.model";

// to get details of specific user
export async function GET(req: Request, { params }: { params: any }) {
  try {
    const username = (await params).username;
    if (!username) {
      return NextResponse.json(
        { message: "Invalid username" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username })
      .select(
        "username fullname bio socials email avatar followerCount followeeCount createdAt"
      )
      .lean();
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "user details fetched", user },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "err fetching user details" },
      { status: 500 }
    );
  }
}
