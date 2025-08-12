"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, Receipt, Settings, ShieldCheck, User } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";
import { BreadcrumbResponsive } from "../dashboardLayout/BreadCrumbResponsive";
import { Button } from "@/components/ui/button";
import { Github } from "@lobehub/icons";
import Link from "next/link";
import Logo from "../Logo";
import { SidebarFolderSection } from "@/components/dashboardLayout/SidebarFolderSection";
import { SidebarMainLinks } from "@/components/dashboardLayout/SidebarMainLinks";
import ThemeToggle from "../common/ThemeToggle";
import { cn } from "@/lib/utils";
import { getPlanColor } from "@/lib/ui-utils";
import { useCurrentUser } from "@/lib/queries/user";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const { data: currentUser } = useCurrentUser();

  const router = useRouter();

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Premium":
        return "border-primary text-primary";
      case "Enterprise":
        return "border-blue-500 text-blue-500";
      default:
        return "border-muted-foreground text-muted-foreground";
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="px-2 py-2">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMainLinks />
          <SidebarFolderSection />
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible className="w-full">
                <div className="relative">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-10 w-full justify-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{user.fullName || user.username}</span>
                      {/** Toggle icon */}
                      <ChevronsUpDown className="ml-auto size-4 transition-transform data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="bg-muted/60 absolute bottom-full z-50 mb-2 w-full space-y-1 rounded-lg border px-1 py-2 shadow-lg">
                    <Link
                      href="/profile"
                      className="hover:bg-muted-foreground/10 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition"
                    >
                      <User className="size-4" />
                      Profile
                    </Link>

                    <Link
                      href="/billing"
                      className="hover:bg-muted-foreground/10 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition"
                    >
                      <Receipt className="size-4" />
                      Billing
                    </Link>

                    <button
                      onClick={() => openUserProfile()}
                      className="hover:bg-muted-foreground/10 flex w-full cursor-pointer items-center justify-start gap-2 rounded-md px-2 py-1.5 text-sm transition"
                    >
                      <Settings className="size-4" />
                      Manage Account
                    </button>

                    <SignOutButton>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                        <LogOut className="size-4 text-red-600" />
                        Log out
                      </div>
                    </SignOutButton>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />

          <div className="flex flex-1 items-center justify-between gap-2">
            <BreadcrumbResponsive />

            <div className="ml-auto flex items-center">
              <ThemeToggle />

              <Button
                variant="ghost"
                className="flex cursor-pointer items-center justify-center p-0"
                onClick={() => window.open("https://github.com/Genius-30/intelli-prompt", "_blank")}
              >
                <Github size={32} />
              </Button>

              {currentUser?.plan && (
                <Badge
                  variant="outline"
                  className={cn(
                    "mx-2 border-2 text-xs font-semibold capitalize sm:mr-4",
                    getPlanColor(currentUser.plan),
                  )}
                >
                  {currentUser.plan}
                </Badge>
              )}

              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/pricing")}
                className="xs:flex hidden items-center border-0 bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB300] text-xs text-black shadow-sm hover:from-[#FFC300] hover:to-[#FFD700]"
              >
                <ShieldCheck className="h-4 w-4" /> Upgrade Plan
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
