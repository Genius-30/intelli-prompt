import ExplorePage from "@/components/pages/public/ExplorePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Prompts | IntelliPrompt",
  description: "Discover public AI prompts shared by the IntelliPrompt community.",
  openGraph: {
    title: "Explore Prompts | IntelliPrompt",
    description: "Browse and discover public prompts crafted by the community on IntelliPrompt.",
    url: "https://intelliprompt.app/explore",
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-explore.png",
        width: 1200,
        height: 630,
        alt: "Explore Prompts on IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Prompts | IntelliPrompt",
    description: "Discover public AI prompts shared by the IntelliPrompt community.",
    images: ["https://intelliprompt.app/og-explore.png"],
  },
};

export default async function page() {
  return (
    <div>
      <ExplorePage />
    </div>
  );
}
