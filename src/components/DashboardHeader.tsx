"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToogle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

export function DashboardHeader() {
  const { resolvedTheme } = useTheme();

  return (
    <header className="flex items-center justify-between pr-6 py-4 border-b bg-background">
      <SidebarTrigger size={"lg"} className="mx-2" />
      <Separator orientation="vertical" />

      <h1 className="text-xl font-semibold mr-auto ml-6">Dashboard</h1>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserButton
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </header>
  );
}
