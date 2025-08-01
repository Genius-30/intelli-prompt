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

    const data = await getSetCache("savedPrompts", 60, () => getSavedPrompts(userId));

    return NextResponse.json({ message: "user saved data fetched", data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch saved data" }, { status: 500 });
  }
}

async function getSavedPrompts(userId: any) {
  const favPrompts = await Prompt.find({ ownerId: userId, isFavorite: true });
  const favVersions = await Version.find({ ownerId: userId, isFavorite: true });
  const savedSharedPrompts = await SharedPrompt.find({ ownerId: userId, likes: userId });

  return {
    favPrompts,
    favVersions,
    savedSharedPrompts,
  };
}
