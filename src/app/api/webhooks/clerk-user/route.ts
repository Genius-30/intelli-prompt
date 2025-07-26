import { NextRequest } from "next/server";
import { User } from "@/models/user.model";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDb from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const event: WebhookEvent = await verifyWebhook(req);

    const { type, data } = event;

    if (type === "user.created" || type === "user.updated") {
      await connectDb();

      await User.findOneAndUpdate(
        { _id: data.id },
        {
          email: data.email_addresses?.[0]?.email_address,
          username: data.username,
          fullname: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          avatar:
            data.image_url ||
            `https://ui-avatars.com/api?name=${data.username}`,
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
