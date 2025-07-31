import { Metadata } from "next";
import ProfilePage from "../../components/pages/dashboard/ProfilePage";

export const metadata: Metadata = {
  title: "User Profile | IntelliPrompt",
  description:
    "Explore prompt collections and activity of top AI builders on IntelliPrompt.",
  openGraph: {
    title: "User Profile | IntelliPrompt",
    description:
      "Check out public prompts, stats, and favorites from the IntelliPrompt community.",
    url: "https://intelliprompt.app/u", // Dynamically append /username if SSR handled
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-profile.png",
        width: 1200,
        height: 630,
        alt: "AI Prompt Creator Profile – IntelliPrompt",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Profile | IntelliPrompt",
    description:
      "Explore AI prompt collections and contributions by top IntelliPrompt users.",
    images: ["https://intelliprompt.app/og-profile.png"],
  },
};

export default function page() {
  return <ProfilePage />;
}
