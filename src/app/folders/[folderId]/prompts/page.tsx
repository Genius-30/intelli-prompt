import { Metadata } from "next";
import PromptsList from "./PromptsList";

export const metadata: Metadata = {
  title: "Prompts | IntelliStack",
  description: "Explore all prompts for a folder, manage favorites, and more.",
  openGraph: {
    title: "Prompts | IntelliStack",
    description:
      "Explore all prompts for a folder, manage favorites, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompts | IntelliStack",
    description:
      "Explore all prompts for a folder, manage favorites, and more.",
  },
};

export default function page() {
  return <PromptsList />;
}
