import { Metadata } from "next";
import { PromptVersionsClient } from "./PromptVersionsClient";

export const metadata: Metadata = {
  title: "Prompt Versions | IntelliStack",
  description:
    "View and manage all versions of your saved prompt inside IntelliStack.",
  openGraph: {
    title: "Prompt Versions | IntelliStack",
    description: "Explore all your prompt versions with version control.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Versions | IntelliStack",
    description: "Explore all your prompt versions with version control.",
  },
};

export default function PromptVersionsPage() {
  return <PromptVersionsClient />;
}
