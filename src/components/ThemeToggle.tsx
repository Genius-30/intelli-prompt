"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useTheme } from "next-themes";

type ModeToggleProps = {
  readonly showLabel?: boolean;
};

export default function ThemeToggle({ showLabel = false }: ModeToggleProps) {
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
      className={`gap-2 flex items-center ${showLabel ? "w-full" : ""}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {showLabel && (isDark ? "Light" : "Dark")}
    </Button>
  );
}
