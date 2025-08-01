import { Metadata } from "next";
import PromptResponsesPage from "../../../../../../../../../components/pages/dashboard/PromptResponsesPage";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "All Responses",
  description: "Compare AI-generated responses from multiple models in one view.",
  openGraph: {
    title: "All Responses",
    description: "View and analyze responses from top AI models like GPT-4, Claude, and Gemini.",
    url: `${SITE_URL}/responses`, // adjust if dynamic
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-all-responses.png`,
        width: 1200,
        height: 630,
        alt: "Compare AI Responses – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Responses",
    description: "Easily compare responses from various AI models in one place.",
    images: [`${SITE_URL}/og-all-responses.png`],
  },
};

export default function Page() {
  return <PromptResponsesPage />;
}
