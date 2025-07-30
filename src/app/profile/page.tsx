import { Metadata } from "next";
import ProfilePage from "../../components/pages/dashboard/ProfilePage";

export const metadata: Metadata = {
  title: "Profile | IntelliPrompt",
  description: "User profile page",
};

export default function page() {
  return <ProfilePage />;
}
