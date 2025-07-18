import { NextResponse } from 'next/server';
import { User } from '@/models/user.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function GET(request: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (!query) {
      return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }
  
    const users = await User.find({
      $or: [
        { username: { $regex: query } },
        { fullname: { $regex: query } },
      ]
    })
    .select('-email -bio -tokenLimit -tokensUsed -followerCount -followeeCount -plan -subscriptionEnds -streak -createdAt -updatedAt')
    .limit(10).lean();

    return NextResponse.json({ message: 'fetched users successfully', users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}