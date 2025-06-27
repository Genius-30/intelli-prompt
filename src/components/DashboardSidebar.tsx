"use client";

import {
  Bot,
  LayoutDashboard,
  ScrollText,
  Settings,
  Terminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agents",
    url: "/dashboard/agents",
    icon: Bot,
  },
  {
    title: "Prompts",
    url: "/dashboard/prompts",
    icon: Terminal,
  },
  {
    title: "Logs",
    url: "/dashboard/logs",
    icon: ScrollText,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="hidden md:flex border-r bg-muted/40 min-w-[220px]">
      <SidebarContent className="flex flex-col h-full p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-primary">
            <Logo />
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (pathname.startsWith(item.url + "/") &&
                    item.url !== "/dashboard");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors font-medium",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent hover:text-foreground/90 text-muted-foreground"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
