import LeaderboardPage from "@/components/pages/public/LeaderboardPage";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Discover the top contributors and prompt engineers in the IntelliPrompt community.",
  openGraph: {
    title: "Leaderboard",
    description: "See who’s leading with the best AI prompts and shared responses.",
    url: `${SITE_URL}/leaderboard`,
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-leaderboard.png`,
        width: 1200,
        height: 630,
        alt: "IntelliPrompt Leaderboard – Top Prompt Engineers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaderboard",
    description: "Top AI prompt creators ranked by community impact.",
    images: [`${SITE_URL}/og-leaderboard.png`],
  },
};

export default function page() {
  return <LeaderboardPage />;
}
