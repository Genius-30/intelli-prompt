import { NextRequest, NextResponse } from "next/server";

import { ModelResponse } from "@/models/modelResponse.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

// save modelResponse
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { versionId, model, temperature, response } = await req.json();
    if (!versionId || !model || temperature == null || !response) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    const modelResponse = await ModelResponse.create({
      versionId,
      ownerId: userId,
      model,
      temperature,
      response,
    });

    return NextResponse.json(
      { message: "modelResponse saved", modelResponse },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "err saving modelResponse" },
      { status: 500 }
    );
  }
}
