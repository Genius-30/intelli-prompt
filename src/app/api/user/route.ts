import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

// get public user profile
export async function GET(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const mongoUser = await User.findById({ _id: userId }).lean();
    if (!mongoUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user details fetched", mongoUser }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "err fetching user details" }, { status: 500 });
  }
}

// updates user profile
export async function PATCH(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const updateFields: any = {};

    const { bio, socials } = await req.json();
    if (bio !== undefined) {
      if (typeof bio !== "string" || bio.length > 120) {
        return NextResponse.json({ message: "Invalid bio or too lenghty" }, { status: 400 });
      }
      updateFields.bio = bio;
    }

    if (socials !== undefined) {
      if (
        !Array.isArray(socials) ||
        socials.some(
          (item) =>
            typeof item.label !== "string" ||
            typeof item.url !== "string" ||
            !/^https?:\/\/.+/.test(item.url),
        )
      ) {
        return NextResponse.json({ message: "Invalid socials format" }, { status: 400 });
      }
      updateFields.socials = socials;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const updated = await User.updateOne({ _id: userId }, { $set: updateFields });
    if (updated.modifiedCount === 0) {
      return NextResponse.json({ message: "err updating user details" }, { status: 500 });
    }

    return NextResponse.json({ message: "user updated" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "err updating user details" }, { status: 500 });
  }
}
