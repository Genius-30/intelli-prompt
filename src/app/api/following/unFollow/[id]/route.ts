// Unfollow a user
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { Follow } from '@/models/follow.model';

export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
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
    
    return NextResponse.json({ message: 'user unfollowed successfully' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'error unfollowing user' }, { status: 500 });
  }
}