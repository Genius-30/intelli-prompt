import { NextResponse } from "next/server";
import { SharedPrompt } from "@/models/sharedPrompt.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import mongoose from "mongoose";

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
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const sharedPromptId = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(sharedPromptId)) {
      return NextResponse.json({ message: "invalid sharedPromptId" }, { status: 400 });
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : null;

    // Aggregation to get comments with populated author details
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
          isUserLiked: { $in: [userId, "$comments.likes"] },
          isUserOwned: { $eq: ["$comments.userId", userId] },
          userId: "$comments.userId",
          author: {
            _id: "$author._id",
            username: "$author.username",
            avatar: "$author.avatar",
          },
        },
      },
    ]);

    const transformedComments = comments
      .map((comment: any) => ({
        _id: comment._id,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
        likeCount: comment.likeCount,
        isUserLiked: comment.isUserLiked,
        isUserOwned: comment.isUserOwned,
        author: comment.author,
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const limitedComments = limit ? transformedComments.slice(0, limit) : transformedComments;

    return NextResponse.json(
      {
        message: "Comments fetched",
        comments: limitedComments,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Error fetching comments" }, { status: 500 });
  }
}
