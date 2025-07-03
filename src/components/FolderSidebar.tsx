"use client";

import { Plus, MoreVertical } from "lucide-react";
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

export function FolderSidebar() {
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    /* openEditFolder(folder) */
                                  }}
                                >
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    /* confirmDeleteFolder(folder._id) */
                                  }}
                                >
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom: Add Folder Button */}
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start cursor-pointer"
            onClick={() => {
              // openCreateFolderModal()
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
