import LibraryPage from "@/components/pages/dashboard/LibraryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library | IntelliPrompt",
  description:
    "View all your favorited prompts, versions, and AI responses in one place for quick access and reuse.",
  openGraph: {
    title: "Library | IntelliPrompt",
    description:
      "Your personal collection of favorite prompts, versions, and responses on IntelliPrompt.",
    url: "https://intelliprompt.app/saved",
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-saved.png",
        width: 1200,
        height: 630,
        alt: "Your Favorite AI Content – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Library | IntelliPrompt",
    description:
      "Quickly revisit your top prompts, versions, and AI responses anytime.",
    images: ["https://intelliprompt.app/og-saved.png"],
  },
};

export default function page() {
  return <LibraryPage />;
}
