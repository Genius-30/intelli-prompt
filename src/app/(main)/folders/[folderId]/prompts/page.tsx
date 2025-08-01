import { Metadata } from "next";
import dynamic from "next/dynamic";

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

const PromptsList = dynamic(() => import("./PromptsList"), { ssr: false });

export default function page() {
  return <PromptsList />;
}
