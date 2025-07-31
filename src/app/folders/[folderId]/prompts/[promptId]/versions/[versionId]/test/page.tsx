import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Test Prompt | IntelliPrompt",
  description: "Run your prompt across multiple AI models and fine-tune responses in real-time.",
  openGraph: {
    title: "Test Prompt | IntelliPrompt",
    description: "Test your AI prompt across GPT, Gemini, Claude and more — all in one place.",
    url: "https://intelliprompt.app/test", // Update based on your routing
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-test-prompt.png", // Use a model comparison style image if possible
        width: 1200,
        height: 630,
        alt: "Test Prompts with Multiple AI Models – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Prompt | IntelliPrompt",
    description: "Compare how different LLMs respond to your prompt with real-time testing tools.",
    images: ["https://intelliprompt.app/og-test-prompt.png"],
  },
};

const TestPromptPage = dynamic(() => import('./TestPromptClient'), { ssr: false })

export default function Page() {
  return <TestPromptPage />;
}
