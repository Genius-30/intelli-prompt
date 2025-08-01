import FoldersPage from "@/components/pages/dashboard/FoldersPage";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/constants/SITE_URL";

export const metadata: Metadata = {
  title: "Folder",
  description: "View and manage AI prompts organized in this folder.",
  openGraph: {
    title: "Folder",
    description: "Explore and organize AI prompts inside your IntelliPrompt folder.",
    url: `${SITE_URL}/folder`, // dynamic ID will update via router
    siteName: "IntelliPrompt",
    images: [
      {
        url: `${SITE_URL}/og-folder.png`,
        width: 1200,
        height: 630,
        alt: "Prompt Folder – IntelliPrompt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folder",
    description: "View and manage AI prompts organized in this folder.",
    images: [`${SITE_URL}/og-explore.png`],
  },
};

export default function page() {
  return <FoldersPage />;
}
