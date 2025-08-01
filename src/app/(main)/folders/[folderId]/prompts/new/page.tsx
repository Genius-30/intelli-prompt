import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "New Prompt",
  description: "Create and optimize a new AI prompt using IntelliPrompt’s smart editor.",
  openGraph: {
    title: "New Prompt",
    description:
      "Start crafting a new AI prompt with IntelliPrompt's powerful prompt editor and model testing tools.",
    url: `${SITE_URL}/new-prompt`,
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-new-prompt.png`,
        width: 1200,
        height: 630,
        alt: "New Prompt Editor – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Prompt",
    description: "Craft, optimize, and test your next AI prompt — all in one place.",
    images: [`${SITE_URL}/og-new-prompt.png`],
  },
};

const NewPromptClient = dynamic(() => import("./NewPromptClient"), { ssr: false });

export default function NewPromptPage() {
  return <NewPromptClient />;
}
