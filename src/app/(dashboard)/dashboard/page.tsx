import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Dashboard | IntelliPrompt",
  description: "Your workspace to manage folders, prompts, and recent activity.",
  openGraph: {
    title: "Dashboard | IntelliPrompt",
    description: "Manage your prompt workspace, explore folders, and stay organized.",
  },
  twitter: {
    card: "summary",
    title: "Dashboard | IntelliPrompt",
    description: "Your personal hub for managing prompts on IntelliPrompt.",
  },
};

// const DashboardClient = dynamic(() => import('./DashboardClient'), { ssr: false });
import DashboardClient from "./DashboardClient";
export default function DashboardPage() {
  return <DashboardClient />;
}