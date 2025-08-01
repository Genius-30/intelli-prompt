import EditVersionPage from "../../../../../../../../components/pages/dashboard/EditVersionPage";
import { Metadata } from "next";

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

export default function page() {
  return <EditVersionPage />;
}
