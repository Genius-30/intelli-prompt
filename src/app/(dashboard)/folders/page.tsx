import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Folder | IntelliPrompt",
  description: "View and manage AI prompts organized in this folder.",
  openGraph: {
    title: "Folder | IntelliPrompt",
    description: "Explore and organize AI prompts inside your IntelliPrompt folder.",
    url: "https://intelliprompt.app/folder", // dynamic ID will update via router
    siteName: "IntelliPrompt",
    images: [
      {
        url: "https://intelliprompt.app/og-folder.png",
        width: 1200,
        height: 630,
        alt: "Prompt Folder – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folder | IntelliPrompt",
    description: "View and manage AI prompts organized in this folder.",
    images: ["https://intelliprompt.app/og-folder.png"],
  },
};

const FolderList = dynamic(() => import('./FolderList'), { ssr: false })

export default function FoldersPage() {
  return <FolderList />;
}
