import { Metadata } from "next";
import PromptFormClient from "./PromptFormClient";

export const metadata: Metadata = {
  title: "Create New Prompt | IntelliStack",
  description:
    "Add a new AI prompt with IntelliStack’s easy-to-use form interface.",
  openGraph: {
    title: "Create New Prompt | IntelliStack",
    description:
      "Add a new AI prompt with IntelliStack’s easy-to-use form interface.",
    url: "https://yourdomain.com/prompts/new",
    siteName: "IntelliStack",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Create a new prompt on IntelliStack",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create New Prompt | IntelliStack",
    description: "Quickly create and manage AI prompts with IntelliStack.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function NewPromptPage() {
  return <PromptFormClient />;
}
