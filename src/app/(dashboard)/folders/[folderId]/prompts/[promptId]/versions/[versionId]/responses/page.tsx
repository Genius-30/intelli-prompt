import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "All Responses | IntelliPrompt",
  description: "Compare AI-generated responses from multiple models in one view.",
  openGraph: {
    title: "All Responses | IntelliPrompt",
    description: "View and analyze responses from top AI models like GPT-4, Claude, and Gemini.",
    url: "https://intelliprompt.app/responses", // adjust if dynamic
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-all-responses.png",
        width: 1200,
        height: 630,
        alt: "Compare AI Responses – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Responses | IntelliPrompt",
    description: "Easily compare responses from various AI models in one place.",
    images: ["https://intelliprompt.app/og-all-responses.png"],
  },
};

const AllResponsesClient = dynamic(() => import('./AllResponsesClient'), { ssr: false })

export default function Page() {
  return <AllResponsesClient />;
}
