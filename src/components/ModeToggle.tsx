"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type ModeToggleProps = {
  readonly showLabel?: boolean;
};

export function ModeToggle({ showLabel = false }: ModeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (!theme) setTheme("system");
  }, [theme, setTheme]);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 flex items-center justify-start"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {showLabel && (isDark ? "Light" : "Dark")}
    </Button>
  );
}
