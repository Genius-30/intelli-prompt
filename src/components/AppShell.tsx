"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className={cn("min-h-screen", isDashboard && "bg-background")}>
      {!isDashboard && <Navbar />}
      {children}
    </div>
  );
}
