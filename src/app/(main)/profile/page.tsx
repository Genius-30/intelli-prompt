import { Metadata } from "next";
import ProfilePage from "@/components/pages/dashboard/ProfilePage";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "Profile",
  description: "Explore prompt collections and activity of top AI builders on IntelliPrompt.",
  openGraph: {
    title: "Profile",
    description: "Check out public prompts, stats, and favorites from the IntelliPrompt community.",
    url: `${SITE_URL}/profile`, // Dynamically append /username if SSR handled
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-profile.png`,
        width: 1200,
        height: 630,
        alt: "AI Prompt Creator Profile – IntelliPrompt",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile",
    description: "Explore AI prompt collections and contributions by top IntelliPrompt users.",
    images: [`${SITE_URL}/og-profile.png`],
  },
};

export default function page() {
  return <ProfilePage />;
}
