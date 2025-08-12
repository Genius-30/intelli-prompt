import { NextResponse } from "next/server";
import { Prompt } from "@/models/prompt.model";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { Version } from "@/models/version.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";

export async function GET(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const data = await getSetCache("savedPrompts:${userId}", 60, () => getSavedPrompts(userId));

    return NextResponse.json({ message: "user saved data fetched", data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch saved data" }, { status: 500 });
  }
}

async function getSavedPrompts(userId: any) {
  const favPrompts = await Prompt.find({ ownerId: userId, isFavorite: true });
  const favVersions = await Version.find({ ownerId: userId, isFavorite: true });
  const savedSharedPrompts = await SharedPrompt.aggregate([
    {
      $match: {
        saves: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
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
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        versionId: 1,
        tags: 1,
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
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
  ]);

  return {
    favPrompts,
    favVersions,
    savedSharedPrompts,
  };
}
