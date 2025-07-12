import { Metadata } from "next";
import AllResponsesClient from "./AllResponsesClient";

export const metadata: Metadata = {
  title: "Prompt Responses | IntelliStack",
  description:
    "View all the generated AI model responses for this prompt version.",
  openGraph: {
    title: "Prompt Responses | IntelliStack",
    description:
      "View all the generated AI model responses for this prompt version.",
    url: "https://yourdomain.com/prompts/[promptId]/versions/[versionId]/responses", // Update domain
    siteName: "IntelliStack",
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
    title: "Prompt Responses | IntelliStack",
    description: "All model responses in one place.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function Page() {
  return <AllResponsesClient />;
}
