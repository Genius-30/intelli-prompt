import { Metadata } from "next";
import { PromptVersionsClient } from "./PromptVersionsClient";

export const metadata: Metadata = {
  title: "Prompt Versions | IntelliPrompt",
  description:
    "View and manage all versions of your saved prompt inside IntelliPrompt.",
  openGraph: {
    title: "Prompt Versions | IntelliPrompt",
    description: "Explore all your prompt versions with version control.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Versions | IntelliPrompt",
    description: "Explore all your prompt versions with version control.",
  },
};

export default function PromptVersionsPage() {
  return <PromptVersionsClient />;
}
