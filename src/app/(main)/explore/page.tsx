import ExplorePage from "@/components/pages/public/ExplorePage";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "Explore Prompts",
  description: "Discover public AI prompts shared by the IntelliPrompt community.",
  openGraph: {
    title: "Explore Prompts",
    description: "Browse and discover public prompts crafted by the community on IntelliPrompt.",
    url: `${SITE_URL}/explore`,
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-explore.png`,
        width: 1200,
        height: 630,
        alt: "Explore Prompts on IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Prompts",
    description: "Discover public AI prompts shared by the IntelliPrompt community.",
    images: [`${SITE_URL}/og-explore.png`],
  },
};

export default async function page() {
  return (
    <div>
      <ExplorePage />
    </div>
  );
}
