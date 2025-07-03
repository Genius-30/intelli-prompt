"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPrompts = pathname.startsWith("/prompts");

  return (
    <div className={cn("min-h-screen", isPrompts && "bg-background")}>
      {!isPrompts && <Navbar />}
      {children}
    </div>
  );
}
