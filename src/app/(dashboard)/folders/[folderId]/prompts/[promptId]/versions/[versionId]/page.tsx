import { Metadata } from "next";
import EditPromptClient from "./EditPromptClient";

export const metadata: Metadata = {
  title: "Edit Prompt | IntelliStack",
  description: "Edit your AI prompt version easily with IntelliStack.",
  openGraph: {
    title: "Edit Prompt | IntelliStack",
    description: "Edit your AI prompt version easily with IntelliStack.",
    url: "https://yourdomain.com/prompts/[promptId]/versions/[versionId]/edit",
    siteName: "IntelliStack",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edit AI prompt on IntelliStack",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit Prompt | IntelliStack",
    description: "Edit your AI prompt version easily with IntelliStack.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function EditPromptPage() {
  return <EditPromptClient />;
}
