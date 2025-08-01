import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Test Prompt",
  description: "Run your prompt across multiple AI models and fine-tune responses in real-time.",
  openGraph: {
    title: "Test Prompt",
    description: "Test your AI prompt across GPT, Gemini, Claude and more — all in one place.",
    url: `${SITE_URL}/test`, // Update based on your routing
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-test-prompt.png`, // Use a model comparison style image if possible
        width: 1200,
        height: 630,
        alt: "Test Prompts with Multiple AI Models – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Prompt",
    description: "Compare how different LLMs respond to your prompt with real-time testing tools.",
    images: [`${SITE_URL}/og-test-prompt.png`],
  },
};

const TestPromptPage = dynamic(() => import("./TestPromptClient"), { ssr: false });

export default function Page() {
  return <TestPromptPage />;
}
