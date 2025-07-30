import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Prompt Versions | IntelliPrompt",
  description: "Review changes, track history, and compare versions of your AI prompt.",
  openGraph: {
    title: "Prompt Versions | IntelliPrompt",
    description: "View the version history of your prompt and analyze edits over time.",
    url: "https://intelliprompt.app/prompt/version", // or dynamic if using [id]
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-prompt-version.png",
        width: 1200,
        height: 630,
        alt: "Prompt Version History – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Versions | IntelliPrompt",
    description: "Review and compare versions of your AI prompt with full history tracking.",
    images: ["https://intelliprompt.app/og-prompt-version.png"],
  },
};

import { PromptVersionsClient } from "./PromptVersionsClient";

export default function PromptVersionsPage() {
  return <PromptVersionsClient />;
}
