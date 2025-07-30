import FolderList from "./FolderList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Folders | IntelliStack",
  description: "View and manage all your saved AI folders in one place.",
  openGraph: {
    title: "Your Folders | IntelliStack",
    description: "Manage your AI folders efficiently.",
    url: "https://your-domain.com/folders",
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

export default function FoldersPage() {
  return <FolderList />;
}
