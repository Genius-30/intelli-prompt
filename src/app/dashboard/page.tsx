import DashboardPage from "@/components/pages/dashboard/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | IntelliPrompt",
  description:
    "Your workspace to manage folders, prompts, and recent activity.",
  openGraph: {
    title: "Dashboard | IntelliPrompt",
    description:
      "Manage your prompt workspace, explore folders, and stay organized.",
  },
  twitter: {
    card: "summary",
    title: "Dashboard | IntelliPrompt",
    description: "Your personal hub for managing prompts on IntelliPrompt.",
  },
};

export default function page() {
  return <DashboardPage />;
}
