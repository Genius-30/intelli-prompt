"use client";

import { useEffect, useState } from "react";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function CustomToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Toaster theme={resolvedTheme as "light" | "dark" | "system" | undefined} />
  );
}
