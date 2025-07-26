import { NextResponse } from "next/server";
import { User } from "@/models/user.model";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    if (!username)
      return NextResponse.json(
        { message: "Username required" },
        { status: 400 }
      );

    const user = await User.findOne({ username }).lean();

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}
