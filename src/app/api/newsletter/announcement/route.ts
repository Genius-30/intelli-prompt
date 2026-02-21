import { User } from "@/models/user.model";
import { emailQueue } from "@/lib/emailQueue";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { message } = await req.json();
    if (!message) {
      return new Response("Missing required fields", { status: 400 });
    }
    const users = await User.find({ newsletter: true }).select("email").lean();
    if (!users.length) {
      return new Response("No newsletter subscribers found", { status: 404 });
    }

    // Add jobs to the emailQueue for each user
    for (const user of users) {
      await emailQueue.add("announcement", {
        user,
        message,
      });
    }

    return new Response("email queued!", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
