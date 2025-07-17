import {
  BookmarkIcon,
  LayoutDashboardIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function SidebarMainLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/explore", label: "Explore", icon: UsersIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: TrophyIcon },
    { href: "/saved", label: "Saved", icon: BookmarkIcon },
  ];

  return (
    <SidebarGroup key="main">
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild>
                <Link
                  href={href}
                  className={cn(
                    "text-sm font-medium w-full text-left",
                    pathname === href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={20} /> {label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
