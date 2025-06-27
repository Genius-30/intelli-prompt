import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Prompt } from "@/lib/models/prompt";
import { auth } from "@clerk/nextjs/server";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { title, prompt, model, temperature, variables } = await req.json();

    const newPrompt = await Prompt.create({
      userId,
      title,
      prompt,
      model,
      temperature,
      variables,
    });

    return successResponse(newPrompt, 201);
  } catch (err) {
    console.error(err);
    return errorResponse("Server Error", 500);
  }
}

export async function GET() {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    const prompts = await Prompt.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json(prompts);
  } catch (err) {
    console.error(err);
    return errorResponse("Server Error", 500);
  }
}
