"use client";

import * as React from "react";
import { Moon, Sun, Laptop2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModeToggleProps = {
  showLabel?: boolean; // 🆕 Optional prop (default false)
};

export function ModeToggle({ showLabel = false }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  const themeMap = {
    light: { icon: <Sun className="w-4 h-4" />, label: "Light" },
    dark: { icon: <Moon className="w-4 h-4" />, label: "Dark" },
    system: { icon: <Laptop2 className="w-4 h-4" />, label: "System" },
  };

  const current = themeMap[theme as keyof typeof themeMap] ?? themeMap.system;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 flex items-center justify-start"
        >
          {current.icon}
          {showLabel && current.label}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="z-[999]">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop2 className="w-4 h-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
