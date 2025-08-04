"use client";

import { dark } from "@clerk/themes";
import { useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function useOpenAuthModal() {
  const { openSignIn } = useClerk();
  const { resolvedTheme } = useTheme();

  return (redirectUrl?: string) => {
    openSignIn({
      redirectUrl: redirectUrl || window.location.href,
      appearance: {
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      },
    });
  };
}
