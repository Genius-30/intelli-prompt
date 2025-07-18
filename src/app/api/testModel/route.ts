import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { ModelResponse } from "@/models/modelResponse.model";

// to save a model response
export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { versionId, model, temperature, response } = await req.json();
    if (!versionId || !model || !response) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    const saved = await ModelResponse.create({
      versionId,
      ownerId: userId,
      model,
      temperature,
      response,
    });

    return NextResponse.json({ message: "Response saved", saved }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to save response", err }, { status: 500 });
  }
}
