"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToogle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { BreadcrumbResponsive } from "./BreadCrumbResponsive";

export function DashboardHeader() {
  const { resolvedTheme } = useTheme();

  return (
    <header className="flex items-center justify-between pr-6 py-4 border-b bg-background">
      <SidebarTrigger size={"lg"} className="mx-2" />
      <Separator orientation="vertical" />

      <div className="ml-6 mr-auto">
        <BreadcrumbResponsive />
      </div>

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
