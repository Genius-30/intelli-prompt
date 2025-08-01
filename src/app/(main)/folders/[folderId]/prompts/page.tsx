import { Metadata } from "next";
import PromptsPage from "../../../../../components/pages/dashboard/PromptsPage";

export const metadata: Metadata = {
  title: "Prompts",
  description: "Explore all prompts in this folder, manage favorites, and more.",
  openGraph: {
    title: "Prompts",
    description: "Explore all prompts in this folder, manage favorites, and more.",
  },
  twitter: {
    card: "summary",
    title: "Prompts",
    description: "Explore all prompts in this folder, manage favorites, and more.",
  },
};

export default function page() {
  return <PromptsPage />;
}
