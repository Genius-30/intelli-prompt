import { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Profile | IntelliPrompt",
  description: "User profile page",
};

export default function page() {
  return <ProfilePageClient />;
}
