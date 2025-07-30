import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function POST(request: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lastActive = new Date(user.streak.lastActive);
    lastActive.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = today.getTime() - lastActive.getTime();

    if (diff === 86400000) {
      user.streak.current += 1;
    } else if (diff > 86400000) {
      user.streak.current = 1;
    }

    if (user.streak.current > user.streak.best) {
      user.streak.best = user.streak.current;
    }

    user.streak.lastActive = new Date();

    const alreadyLogged = user.streak.history.some((date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (!alreadyLogged) {
      user.streak.history.push(today);
    }

    await user.save();

    return NextResponse.json({ message: "streak updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}
