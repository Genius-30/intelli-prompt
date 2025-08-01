import LibraryPage from "@/components/pages/dashboard/LibraryPage";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "My Library",
  description:
    "View all your favorited prompts, versions, and AI responses in one place for quick access and reuse.",
  openGraph: {
    title: "My Library",
    description:
      "Your personal collection of favorite prompts, versions, and responses on IntelliPrompt.",
    url: `${SITE_URL}/saved`,
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-saved.png`,
        width: 1200,
        height: 630,
        alt: "Your Favorite AI Content – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Library",
    description: "Quickly revisit your top prompts, versions, and AI responses anytime.",
    images: [`${SITE_URL}/og-saved.png`],
  },
};

export default function page() {
  return <LibraryPage />;
}
