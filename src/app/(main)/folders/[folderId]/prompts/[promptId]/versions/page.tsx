import { Metadata } from "next";
import { PromptVersionsPage } from "@/components/pages/dashboard/PromptVersionsPage";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "Prompt Versions",
  description: "Review changes, track history, and compare versions of your AI prompt.",
  openGraph: {
    title: "Prompt Versions",
    description: "View the version history of your prompt and analyze edits over time.",
    url: `${SITE_URL}/prompt/version`, // or dynamic if using [id]
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-prompt-version.png`,
        width: 1200,
        height: 630,
        alt: "Prompt Version History – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Versions",
    description: "Review and compare versions of your AI prompt with full history tracking.",
    images: [`${SITE_URL}/og-prompt-version.png`],
  },
};

export default function page() {
  return <PromptVersionsPage />;
}
