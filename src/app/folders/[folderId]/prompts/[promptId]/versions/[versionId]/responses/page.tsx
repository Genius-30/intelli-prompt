import AllResponsesClient from "./AllResponsesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Responses | IntelliPrompt",
  description:
    "View all the generated AI model responses for this prompt version.",
  openGraph: {
    title: "Prompt Responses | IntelliPrompt",
    description:
      "View all the generated AI model responses for this prompt version.",
    url: "https://yourdomain.com/prompts/[promptId]/versions/[versionId]/responses", // Update domain
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "All AI responses to your prompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Responses | IntelliPrompt",
    description: "All model responses in one place.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function Page() {
  return <AllResponsesClient />;
}
