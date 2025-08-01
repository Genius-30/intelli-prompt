import { LayoutDashboardIcon, LibraryIcon, TrophyIcon, UsersIcon } from "lucide-react";
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
    { href: "/explore", label: "Explore", icon: UsersIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: TrophyIcon },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/library", label: "My Library", icon: LibraryIcon },
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
                    "w-full text-left text-sm font-medium",
                    pathname === href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
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
