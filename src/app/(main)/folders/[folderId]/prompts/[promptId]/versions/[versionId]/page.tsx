import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Edit Prompt Version",
  description: "Edit and improve a specific version of your AI prompt in IntelliPrompt.",
  openGraph: {
    title: "Edit Prompt Version",
    description: "Update and refine a version of your prompt using IntelliPrompt’s editor.",
  },
  twitter: {
    card: "summary",
    title: "Edit Prompt Version",
    description: "Edit and refine your prompt with version control and AI testing tools.",
  },
};

const EditVersionClient = dynamic(() => import("./EditVersionClient"), { ssr: false });

export default function EditPromptPage() {
  return <EditVersionClient />;
}
