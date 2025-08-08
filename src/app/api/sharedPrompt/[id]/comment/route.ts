import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import mongoose from "mongoose";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { getSetCache } from "@/lib/redisCache";

// add a comment to the sharedPrompt
export async function POST(req: Request, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const { content } = await req.json();
    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const prompt = await SharedPrompt.findById(sharedPromptId, { comments: 1 });
    if (!prompt) {
      return NextResponse.json({ message: "Prompt not found" }, { status: 404 });
    }

    const alreadyCommented = prompt.comments.some((c: any) => c.userId === userId);
    if (alreadyCommented) {
      return NextResponse.json({ message: "User has already commented" }, { status: 400 });
    }

    const newComment = {
      userId,
      content,
      likes: [],
      createdAt: new Date(),
    };

    const updatedPrompt = await SharedPrompt.findByIdAndUpdate(
      sharedPromptId,
      { $push: { comments: newComment } },
      { new: true },
    );
    if (!updatedPrompt) {
      return NextResponse.json({ message: "Couldn't add comment" }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Comment added successfully",
        comment: newComment,
        commentsCount: updatedPrompt.comments.length,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Error adding comment" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    await connectDb();

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 3;

    // Try to get userId from session (if logged in)
    let userId: string | null = null;
    try {
      const authResult = await getAuthenticatedUser();
      userId = authResult?.userId || null;
    } catch (e) {
      userId = null;
    }

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const cacheKey = userId
      ? `sharedPromptComments:${sharedPromptId}upto${limit}:user=${userId}`
      : `sharedPromptComments:${sharedPromptId}upto${limit}`;

    const data = await getSetCache(cacheKey, 60, () => getComments(
      { sharedPromptId, userId, limit })
    );

    return NextResponse.json({ message: "Comments fetched", comments: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error fetching comments" }, { status: 500 });
  }
}

async function getComments({
  sharedPromptId,
  userId, 
  limit
}: {
  sharedPromptId: string;
  userId?: string | null;
  limit: number;
}) {
  const comments = await SharedPrompt.aggregate([
      { $match: { _id: mongoose.Types.ObjectId.createFromHexString(sharedPromptId) } },
      { $unwind: "$comments" },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: "$comments._id",
          content: "$comments.content",
          createdAt: "$comments.createdAt",
          likes: "$comments.likes",
          likeCount: { $size: "$comments.likes" },
          userId: "$comments.userId",
          author: {
            _id: "$author._id",
            username: "$author.username",
            avatar: "$author.avatar",
          },
          ...(userId && {
            isUserLiked: { $in: [userId, "$comments.likes"] },
            isUserOwned: { $eq: ["$comments.userId", userId] },
          }),
        },
      },
    ]);

    const transformedComments = comments
      .map((comment: any) => {
        const base = {
          _id: comment._id,
          userId: comment.userId,
          content: comment.content,
          createdAt: comment.createdAt,
          likeCount: comment.likeCount,
          author: comment.author,
        };
        if (userId) {
          return {
            ...base,
            isUserLiked: comment.isUserLiked,
            isUserOwned: comment.isUserOwned,
          };
        }
        return base;
      })
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return limit ? transformedComments.slice(0, limit) : transformedComments;
}
