import { Metadata } from "next";
import TestPromptPage from "./TestPromptClient";

export const metadata: Metadata = {
  title: "Test Prompt | IntelliStack",
  description:
    "Run prompt tests across multiple AI models and analyze responses using IntelliStack.",
  openGraph: {
    title: "Test Prompt Version | IntelliStack",
    description:
      "Run prompt tests across multiple AI models and analyze responses using IntelliStack.",
    url: "https://yourdomain.com/prompts/[promptId]/versions/[versionId]/test", // Replace with real domain
    siteName: "IntelliStack",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Test Prompt on IntelliStack",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Prompt Version | IntelliStack",
    description:
      "Run prompt tests across multiple AI models and analyze responses using IntelliStack.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function Page() {
  return <TestPromptPage />;
}
