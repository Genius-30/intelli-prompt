import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | IntelliPrompt",
  description: "Discover the top contributors and prompt engineers in the IntelliPrompt community.",
  openGraph: {
    title: "Leaderboard | IntelliPrompt",
    description: "See who’s leading with the best AI prompts and shared responses.",
    url: "https://intelliprompt.app/leaderboard",
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-leaderboard.png",
        width: 1200,
        height: 630,
        alt: "IntelliPrompt Leaderboard – Top Prompt Engineers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaderboard | IntelliPrompt",
    description: "Top AI prompt creators ranked by community impact.",
    images: ["https://intelliprompt.app/og-leaderboard.png"],
  },
};

const LeaderboardClient = dynamic(() => import('./LeaderboardClient'), { ssr: false })

function LeaderboardPage() {
  return <LeaderboardClient />;
}

export default LeaderboardPage;
