"use client";

import { ReactNode, useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Loader } from "@/components/ui/loader";
import PublicLayout from "@/components/layouts/PublicLayout";
import { toast } from "sonner";
import { useUpdateStreak } from "@/lib/queries/analytics";
import { useUser } from "@clerk/nextjs";

const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/public/",
  "/explore",
  "/pricing",
  "/leaderboard",
  "/blog",
];

const NO_SHELL_PATHS = ["/sign-in", "/sign-up"];

export default function AppShell({ children }: { readonly children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { mutate: updateStreak } = useUpdateStreak();

  const afterSignInRedirectUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_REDIRECT_URL || "/explore";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isSignedIn && !isLoaded) return;

    const hasUpdatedStreak = sessionStorage.getItem("streak-updated");

    if (!hasUpdatedStreak) {
      updateStreak(undefined, {
        onSuccess: (data) => {
          if (data?.message === "streak updated") {
            toast.success("+1 Streak! 🔥 Keep it going!", {
              position: "top-center",
              duration: 5000,
              className: "text-base font-semibold shadow-xl rounded-lg border border-amber-300",
              style: {
                background: "#fef3c7",
                color: "#92400e",
              },
            });

            sessionStorage.setItem("streak-updated", "true");
          }
        },
      });
    }
  }, [isSignedIn, updateStreak, isLoaded]);

  if (!mounted || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  // ✅ Redirect authenticated users away from `/` to `/explore`
  if (isSignedIn && pathname === "/") {
    redirect(afterSignInRedirectUrl);
  }

  // 1️⃣ Skip *all* shell & toaster for Clerk pages:
  if (NO_SHELL_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  let shell: ReactNode;

  // Signed‑in users get the DashboardLayout
  if (isSignedIn) {
    shell = <DashboardLayout>{children}</DashboardLayout>;
  }
  // Otherwise, if in PUBLIC_PATHS, show public
  else if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    shell = <PublicLayout>{children}</PublicLayout>;
  }
  // Else force sign‑in
  else {
    redirect("/sign-in");
  }

  return <>{shell}</>;
}
