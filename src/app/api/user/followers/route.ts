// Get followers list

import { Follow } from "@/models/follow.model";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function POST(req: Request) {
  try {
    const { personId } = await req.json();

    const followersList = await Follow.find({ followeeId: personId });
    if (!followersList) {
      return NextResponse.json(
        { message: "No followers list found" },
        { status: 404 }
      );
    }
    const followerIds = followersList.map((follow) => follow.followerId);
    const followers = await User.find({ _id: { $in: followerIds } })
      .select("_id fullname username avatar rank")
      .lean();

    return NextResponse.json(
      { message: "fetched followers list", followers },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "error fetching followers list" },
      { status: 500 }
    );
  }
}
