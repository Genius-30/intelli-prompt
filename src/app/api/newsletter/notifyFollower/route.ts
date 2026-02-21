import { Follow } from "@/models/follow.model";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { emailQueue } from "@/lib/emailQueue";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { postTitle, postLink } = await req.json();
    if (!postTitle || !postLink) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const follows = await Follow.find({ followeeId: userId }).lean();
    if (!follows.length) {
      return NextResponse.json({ message: "No followers found" }, { status: 404 });
    }

    const followerIds = follows.map((f) => f.followerId);

    const users = await User.find({ _id: { $in: followerIds }, newsletter: true })
      .select("email")
      .lean();
    if (!users.length) {
      return NextResponse.json(
        { message: "No newsletter subscribers among followers" },
        { status: 404 },
      );
    }

    // Add jobs to the emailQueue for each user
    for (const user of users) {
      await emailQueue.add("notifyFollowers", {
        user,
        postTitle,
        postLink,
      });
    }

    return NextResponse.json({ message: "email queued!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
