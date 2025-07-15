"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  // Show navbar only on root page when user is not logged in
  const shouldShowNavbar = pathname === "/" && !isSignedIn && isLoaded;

  return (
    <div className="min-h-screen">
      {/* ✅ Show Navbar only on root page when user is not logged in */}
      {shouldShowNavbar && <Navbar />}
      {children}
    </div>
  );
}
