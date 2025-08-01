// Get following list

import { Follow } from "@/models/follow.model";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function POST(req: Request) {
  try {
    const { personId } = await req.json();

    const followingList = await Follow.find({ followerId: personId });
    if (!followingList) {
      return NextResponse.json(
        { message: "No following list found" },
        { status: 404 }
      );
    }

    const followeeIds = followingList.map((follow) => follow.followeeId);
    const followees = await User.find({ _id: { $in: followeeIds } })
      .select("_id fullname username avatar rank")
      .lean();

    return NextResponse.json(
      { message: "fetched following list", followees },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "error fetching following list" },
      { status: 500 }
    );
  }
}
