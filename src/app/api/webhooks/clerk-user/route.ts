import { NextRequest } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { User } from "@/models/user.model";
import connectDb from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const event: WebhookEvent = await verifyWebhook(req);

    const { type, data } = event;

    if (type === "user.created" || type === "user.updated") {
      await connectDb();

      await User.findOneAndUpdate(
        { _id: data.id },
        {
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          image: data.image_url,
        },
        { upsert: true, new: true }
      );
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
