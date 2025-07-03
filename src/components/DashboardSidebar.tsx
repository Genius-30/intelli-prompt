"use client";

import {
  Plus,
  MoreVertical,
  FoldersIcon,
  LayoutDashboardIcon,
  CreditCardIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
// import { useGetFolders } from "@/hooks/useGetFolders";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get("folder");

  const isLoading = false; // Replace with actual loading state if needed

  const [folders, setFolders] = useState([
    { _id: "1", name: "Personal" },
    { _id: "2", name: "Work" },
    { _id: "3", name: "Ideas" },
    { _id: "4", name: "Archived" },
  ]); // Replace with actual folder data

  // const { data: folders = [], isLoading } = useGetFolders();

  return (
    <Sidebar className="hidden md:flex border-r bg-muted/40 min-w-[240px]">
      <SidebarContent className="flex flex-col h-full p-4 justify-between">
        {/* Top: Logo & Folders */}
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl font-bold text-primary">
              <Logo />
            </SidebarGroupLabel>

            <SidebarGroupContent className="mt-8">
              {/* Dashboard & Plans */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "text-sm font-medium w-full text-left",
                        pathname === "/dashboard"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <LayoutDashboardIcon size={20} /> Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/plans"
                      className={cn(
                        "text-sm font-medium w-full text-left",
                        pathname === "/plans"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <CreditCardIcon size={20} /> Plans
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              {/* Folder Section Title */}
              <p className="text-xs uppercase text-muted-foreground mt-6 px-2 mb-3 flex items-center gap-2">
                <FoldersIcon size={20} /> Your Folders
              </p>

              <SidebarMenu>
                {folders.length === 0 && (
                  <p className="text-sm text-muted-foreground px-3">
                    No folders yet
                  </p>
                )}

                {isLoading ? (
                  <p className="text-sm text-muted-foreground px-3">
                    Loading folders...
                  </p>
                ) : (
                  folders.map((folder) => {
                    const isActive = activeFolderId === folder._id;
                    return (
                      <SidebarMenuItem key={folder._id}>
                        <SidebarMenuButton asChild className="flex-1">
                          <div
                            className={cn(
                              "group flex items-center justify-between w-full",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                          >
                            <Link
                              href={`/prompts?folder=${folder._id}`}
                              className="flex-1 truncate text-sm font-medium"
                            >
                              <span className="truncate">{folder.name}</span>
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 ml-auto"
                                >
                                  <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => {}}>
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}

                {/* 👉 New Folder button moved here */}
                <SidebarMenuItem className="mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer text-sm"
                    onClick={() => {
                      // openCreateFolderModal()
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
