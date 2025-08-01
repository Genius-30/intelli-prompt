import "./globals.css";

import { CustomToaster } from "@/components/common/CustomToaster";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Providers from "./providers";
import { SITE_URL } from "@/lib/constants/SITE_URL";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "IntelliPrompt - Enhance Prompts, Compare Outputs, Unlock Precision",
    template: "%s | IntelliPrompt",
  },
  description:
    "A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models like GPT-4, Claude, Gemini, and Mistral.",
  appleWebApp: {
    title: "IntelliPrompt",
  },
  openGraph: {
    title: {
      default: "IntelliPrompt - Enhance Prompts, Compare Outputs, Unlock Precision",
      template: "%s | IntelliPrompt",
    },
    description:
      "A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models like GPT-4, Claude, Gemini, and Mistral.",
    type: "website",
    url: `${SITE_URL}`,
    siteName: "IntelliPrompt",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "IntelliPrompt - Enhance Prompts, Compare Outputs, Unlock Precision",
      template: "%s | IntelliPrompt",
    },
    description:
      "A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models like GPT-4, Claude, Gemini, and Mistral.",
    creator: "@intelli_prompt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`scrollbar-thin ${inter.className}`} cz-shortcut-listen="true">
        <Providers>
          {children}
          <CustomToaster />
        </Providers>
      </body>
    </html>
  );
}
