import { NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { User } from '@/models/user.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

// Search sharedPrompts by title, username, or tags
export async function GET(request: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;
    
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const username = searchParams.get('username');
    const tags = searchParams.get('tags'); // comma-separated

    const query: any = {};
    if (title) {
      query.title = { $regex: title };
    }

    if (username) {
      const users = await User.find({ username: { $regex: username } }).select('_id').lean();
      const userIds = users.map(u => u._id);
      if (userIds.length === 0) {
        return NextResponse.json({ results: [] }, { status: 200 });
      }
      query.ownerId = { $in: userIds };
    }

    if (tags) {
      const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagsArr.length > 0) {
        query.tags = { $in: tagsArr };
      }
    }

    const results = await SharedPrompt.find(query)
      .select('title content tags modelUsed ownerId createdAt')
      .sort({ createdAt: -1 })
      .limit(20).lean();

    return NextResponse.json({ message: 'searching sharedPrompts successful', results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search sharedPrompts' }, { status: 500 });
  }
}