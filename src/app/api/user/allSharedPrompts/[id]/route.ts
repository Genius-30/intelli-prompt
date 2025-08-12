import { NextRequest, NextResponse } from "next/server";

import { SharedPrompt } from "@/models/sharedPrompt.model";
import connectDb from "@/lib/db";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";
import { rateLimit } from "@/lib/rateLimit";

// to get all sharedPrompts of specific user
export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();

    await connectDb();

    const personId = (await params).id;
    if (!personId) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const data = await getSetCache(`allSharedPromptsByUser_${personId}`, 60, () =>
      getAllSharedPrompts(personId, userId),
    );
    if (!data) {
      return NextResponse.json({ message: "sharedPrompts not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user details fetched", data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "err fetching user details" }, { status: 500 });
  }
}

async function getAllSharedPrompts(personId: string, userId?: string | null) {
  const baseFields: any = {
    title: 1,
    content: 1,
    versionId: 1,
    tags: 1,
    modelUsed: 1,
    createdAt: 1,
    responseId: 1,
    likeCount: { $size: { $ifNull: ["$likes", []] } },
    saveCount: { $size: { $ifNull: ["$saves", []] } },
    shareCount: { $size: { $ifNull: ["$shares", []] } },
    commentCount: { $size: { $ifNull: ["$comments", []] } },
    isUserLiked: 1,
    isUserSaved: 1,
    isUserShared: 1,
    isUserCommented: 1,
    isUserOwned: 1,
  };

  const pipeline: any[] = [
    { $match: { ownerId: personId } },
    { $sort: { createdAt: -1 } },
    {
      $addFields: userId
        ? {
            isUserLiked: { $in: [userId, { $ifNull: ["$likes", []] }] },
            isUserSaved: { $in: [userId, { $ifNull: ["$saves", []] }] },
            isUserShared: { $in: [userId, { $ifNull: ["$shares", []] }] },
            isUserCommented: {
              $anyElementTrue: {
                $map: {
                  input: { $ifNull: ["$comments", []] },
                  as: "comment",
                  in: { $eq: ["$$comment.userId", userId] },
                },
              },
            },
            isUserOwned: { $eq: ["$ownerId", userId] },
          }
        : {
            isUserLiked: { $literal: false },
            isUserSaved: { $literal: false },
            isUserShared: { $literal: false },
            isUserCommented: { $literal: false },
            isUserOwned: { $literal: false },
          },
    },
    { $project: baseFields },
  ];

  return await SharedPrompt.aggregate(pipeline);
}
