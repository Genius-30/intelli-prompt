import { NextResponse } from 'next/server';
import { SharedPrompt } from '@/models/sharedPrompt.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

// score calculation: likes*1 + shares*8 + saves*3 + comments*5
function getScore(prompt: any): number {
  return (
    (prompt.likes?.length || 0) * 1 +
    (prompt.saves?.length || 0) * 3 +
    (prompt.comments?.length || 0) * 5 +
    (prompt.shares?.length || 0) * 8
  );
}

export async function GET() {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    // Only select fields needed for ranking and display
    const prompts = await SharedPrompt.find({}, {
      title: 1,
      content: 1,
      tags: 1,
      modelUsed: 1,
      likes: 1,
      saves: 1,
      shares: 1,
      comments: 1,
      ownerId: 1,
      createdAt: 1
    }).lean();

    // Calculate score for each prompt
    const scoredPrompts = prompts.map(p => ({ ...p, score: getScore(p) }));

    // Sort by score descending, then by createdAt descending for tie-breaker
    scoredPrompts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const top10 = scoredPrompts.slice(0, 10);

    return NextResponse.json({ message:'trending prompt fetched', top10 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending prompts' }, { status: 500 });
  }
}
