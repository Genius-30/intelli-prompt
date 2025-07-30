// components/AppShell.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";

import { CustomToaster } from "@/components/other/CustomToaster";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Loader } from "@/components/ui/loader";
import PublicLayout from "@/components/layouts/PublicLayout";
import { useUser } from "@clerk/nextjs";

const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/public/",
  "/explore",
  "/pricing",
  "/leaderboard",
];

const NO_SHELL_PATHS = ["/sign-in", "/sign-up"];

export default function AppShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
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

  // 1️⃣ Skip *all* shell & toaster for Clerk pages:
  if (NO_SHELL_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  let shell: ReactNode;

  // Signed‑in always wins
  if (isSignedIn) {
    shell = <DashboardLayout>{children}</DashboardLayout>;
  }
  // Otherwise, if in PUBLIC_PATHS, show public
  else if (PUBLIC_PATHS.includes(pathname)) {
    shell = <PublicLayout>{children}</PublicLayout>;
  }
  // Else force sign‑in
  else {
    redirect("/sign-in");
  }

  return (
    <>
      {shell}
      <CustomToaster />
    </>
  );
}
