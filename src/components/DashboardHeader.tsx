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
    <header className="flex items-center justify-between pr-3 sm:pr-6 py-4 border-b bg-background gap-1">
      <div className="h-full flex items-center gap-1 mx-2">
        <SidebarTrigger size={"lg"} />
        <Separator orientation="vertical" />
      </div>

      <div className="sm:ml-6 mr-auto">
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
