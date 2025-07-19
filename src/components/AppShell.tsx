"use client";

import { useEffect, useState } from "react";

import { CustomToaster } from "./CustomToaster";
import { Loader } from "./ui/loader";
import { Navbar } from "./navbar";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  // Show navbar only on root page when user is not logged in
  const shouldShowNavbar = pathname === "/" && !isSignedIn && isLoaded;

  return (
    <div className="min-h-screen">
      {/* ✅ Show Navbar only on root page when user is not logged in */}
      {shouldShowNavbar && <Navbar />}
      {children}
      <CustomToaster />
    </div>
  );
}
