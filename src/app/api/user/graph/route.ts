import { NextResponse } from 'next/server';
import { User } from '@/models/user.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function GET() {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const history = user.streak.history || [];

    const graphDates = history.map(dateObj => new Date(dateObj).toISOString().split('T')[0]).sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ message:'graph fetched', graphDates }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed fetching graph' }, { status: 500 });
  }
}
