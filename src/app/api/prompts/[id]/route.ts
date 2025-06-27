import { connectDB } from "@/lib/db";
import { Prompt } from "@/lib/models/prompt";
import { errorResponse, successResponse } from "@/lib/response";
import { auth } from "@clerk/nextjs/server";

export async function GET(_: Request, context: { params: { id: string } }) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;

    const prompt = await Prompt.findById(id);
    if (!prompt) return errorResponse("Not Found", 404);

    if (prompt.userId !== userId) {
      return errorResponse("Forbidden", 403);
    }

    return successResponse(prompt);
  } catch (err) {
    console.error("Error fetching prompt:", err);
    return errorResponse("Error fetching prompt", 500);
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;

    const prompt = await Prompt.findById(id);
    if (!prompt) return errorResponse("Not Found", 404);

    if (prompt.userId !== userId) {
      return errorResponse("Forbidden", 403);
    }

    const body = await req.json();

    const updated = await Prompt.findByIdAndUpdate(id, body, {
      new: true,
    });

    return successResponse(updated);
  } catch (err) {
    console.error("Error updating prompt:", err);
    return errorResponse("Update failed", 500);
  }
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;

    const prompt = await Prompt.findById(id);
    if (!prompt) return errorResponse("Not Found", 404);

    if (prompt.userId !== userId) {
      return errorResponse("Forbidden", 403);
    }

    await prompt.deleteOne();

    return successResponse("Prompt deleted successfully");
  } catch (err) {
    console.error("Error deleting prompt:", err);
    return errorResponse("Delete failed", 500);
  }
}
