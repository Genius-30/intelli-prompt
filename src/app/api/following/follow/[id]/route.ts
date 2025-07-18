// Follow a user
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { Follow } from '@/models/follow.model';

export async function POST(
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

    const followInstance = await Follow.create({
      followerId: userId,
      followeeId: strangerId,
    });
    if (!followInstance) {
      return NextResponse.json({ message: "couldn't follow user" }, { status: 400 });
    }

    return NextResponse.json({ message: 'user followed successfully' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'error following user', err }, { status: 500 });
  }
}