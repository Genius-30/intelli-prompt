"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hideNavRoutes = ["/dashboard", "/prompts", "/sign-in", "/sign-up"];

  const pathname = usePathname();

  const isDashboardRoute = hideNavRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div className={cn("min-h-screen", isDashboardRoute && "bg-background")}>
      {/* ✅ Show Navbar only on public pages */}
      {!isDashboardRoute && <Navbar />}
      {children}
    </div>
  );
}
