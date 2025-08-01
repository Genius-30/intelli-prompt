import { ArrowRight, Sparkles } from "lucide-react";

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found",
  description: "This page doesn't exist. Let's get you back on track!",
};

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="text-primary flex justify-center">
          <Sparkles className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">404 – Not Found</h1>
        <p className="text-muted-foreground mt-4">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <p className="text-muted-foreground mt-2 text-sm">
          IntelliPrompt helps you craft, version, and test prompts across AI models. Let’s get you
          back to exploring!
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="border-input bg-background text-foreground hover:bg-muted inline-flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-medium transition"
          >
            Go to Homepage
          </Link>
          <Link
            href="/explore"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-1 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow transition"
          >
            Explore Prompts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
