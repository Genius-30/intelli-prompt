import { Metadata } from "next";
import PromptList from "./PromptList";

export const metadata: Metadata = {
  title: "Your Prompts | IntelliStack",
  description: "View and manage all your saved AI prompts in one place.",
  openGraph: {
    title: "Your Prompts | IntelliStack",
    description: "Manage your AI prompts efficiently.",
    url: "https://your-domain.com/prompts",
    siteName: "IntelliStack",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Prompts | IntelliStack",
    description: "Manage your AI prompts efficiently.",
  },
};

export default function PromptsPage() {
  return <PromptList />;
}
