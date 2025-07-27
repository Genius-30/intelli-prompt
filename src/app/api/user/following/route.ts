// Get following list
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { Follow } from '@/models/follow.model';
import { User } from '@/models/user.model';

export async function GET(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;
    
    const { personId } = await req.json()

    const followingList = await Follow.find({ followerId: personId });
    if (!followingList) {
      return NextResponse.json({ message: 'No following list found' }, { status: 404 });
    }

    const followeeIds = followingList.map(follow => follow.followeeId);
    const followees = await User.find({ _id: { $in: followeeIds } }).select('_id fullname username').lean();

    return NextResponse.json({ message:'fetched following list', followees }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'error fetching following list' }, { status: 500 });
  }
}