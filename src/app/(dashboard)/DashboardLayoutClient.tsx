"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, Receipt, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { BreadcrumbResponsive } from "../../components/dashboardLayout/BreadCrumbResponsive";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "../../components/Logo";
import { ModeToggle } from "../../components/ModeToggle";
import { SidebarFolderSection } from "@/components/dashboardLayout/SidebarFolderSection";
import { SidebarMainLinks } from "@/components/dashboardLayout/SidebarMainLinks";

export default function DashboardLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-10 gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[100px]">
                      {user.fullName || user.username}
                    </span>
                    <ChevronsUpDown className="ml-auto mr-1" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/billing">
                      <Receipt className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => openUserProfile()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Account
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <SignOutButton>
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4 text-red-600" />
                      Log out
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />

          <div className="flex flex-1 items-center justify-between gap-2">
            <BreadcrumbResponsive />

            <div className="flex items-center space-x-2 ml-auto">
              <ModeToggle />

              <Badge
                variant="outline"
                className="text-xs border-primary text-primary border-2 mr-3"
              >
                Pro
              </Badge>

              <Button
                asChild
                variant="default"
                size="sm"
                className="text-xs bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB300] text-black border-0 shadow-sm hover:from-[#FFC300] hover:to-[#FFD700]"
              >
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
