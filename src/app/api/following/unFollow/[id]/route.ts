// Unfollow a user

import { Follow } from "@/models/follow.model";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const strangerId = (await params).id;
    if (!strangerId) {
      return NextResponse.json({ message: "missing stranger's userId" }, { status: 400 });
    }

    await Follow.deleteOne({
      followerId: userId,
      followeeId: strangerId,
    });

    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          followeeCount: -1,
        },
      },
    );

    await User.updateOne(
      { _id: strangerId },
      {
        $inc: {
          followerCount: -1,
        },
      },
    );

    return NextResponse.json({ message: "user unfollowed successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "error unfollowing user" }, { status: 500 });
  }
}
