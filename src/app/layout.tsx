import "./globals.css";

import { AppShell } from "@/components/AppShell";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Providers from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntelliStack - Enhance Prompts, Compare Outputs, Unlock Precision",
  description:
    "A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models like GPT-4, Claude, Gemini, and Mistral.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`scrollbar-thin  ${inter.className}`}
        cz-shortcut-listen="true"
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <Toaster theme="system" />
      </body>
    </html>
  );
}
