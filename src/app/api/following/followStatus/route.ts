import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { Follow } from "@/models/follow.model";

export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if(error) return error
    
    const targetUserId = await req.json();

    if (!userId || !targetUserId)
      return NextResponse.json({ message: "Missing IDs" }, { status: 400 });

    if (userId === targetUserId)
      return NextResponse.json({
        message: "You can't follow yourself",
        isFollowing: false,
        isFollowedBy: false,
      });

    const [isFollowing, isFollowedBy] = await Promise.all([
      Follow.exists({ followerId: userId, followeeId: targetUserId }),
      Follow.exists({ followerId: targetUserId, followeeId: userId }),
    ]);

    return NextResponse.json({
      isFollowing: Boolean(isFollowing),
      isFollowedBy: Boolean(isFollowedBy)
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "couldn't found status" }, { status: 500 });
  }
}
