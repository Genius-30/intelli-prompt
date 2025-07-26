import { Metadata } from "next";
import TestPromptPage from "./TestPromptClient";

export const metadata: Metadata = {
  title: "Test Prompt | IntelliPrompt",
  description:
    "Run prompt tests across multiple AI models and analyze responses using IntelliPrompt.",
  openGraph: {
    title: "Test Prompt Version | IntelliPrompt",
    description:
      "Run prompt tests across multiple AI models and analyze responses using IntelliPrompt.",
    url: "https://yourdomain.com/prompts/[promptId]/versions/[versionId]/test", // Replace with real domain
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Test Prompt on IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Prompt Version | IntelliPrompt",
    description:
      "Run prompt tests across multiple AI models and analyze responses using IntelliPrompt.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function Page() {
  return <TestPromptPage />;
}
