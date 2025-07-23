import EditPromptClient from "./EditPromptClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Version | IntelliStack",
  description: "Edit your AI version easily with IntelliStack.",
  openGraph: {
    title: "Edit Version | IntelliStack",
    description: "Edit your prompt version easily with IntelliStack.",
    url: "https://yourdomain.com/prompts/[promptId]/versions/[versionId]/edit",
    siteName: "IntelliStack",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edit prompt version on IntelliStack",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit Prompt | IntelliStack",
    description: "Edit your prompt version easily with IntelliStack.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function EditPromptPage() {
  return <EditPromptClient />;
}
