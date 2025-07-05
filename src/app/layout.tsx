import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/AppShell";
import Providers from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntelliStack - Enhance Prompts, Compare Outputs, Unlock Precision",
  description: "A powerful prompt engineering workspace to enhance, version, and test prompts across leading AI models like GPT-4, Claude, Gemini, and Mistral.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`scrollbar-thin  ${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <AppShell>{children}</AppShell>
            </Providers>
            <Toaster theme="system" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
