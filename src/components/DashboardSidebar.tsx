"use client";

import {
  Plus,
  MoreVertical,
  LayoutDashboardIcon,
  CreditCardIcon,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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
// import { useGetPrompts } from "@/hooks/useGetPrompts";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CreatePromptModal } from "./prompt/CreatePromptModal";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { promptId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<{ _id: string; name: string }[]>([
    { _id: "1", name: "Personal" },
    { _id: "2", name: "Work" },
    { _id: "3", name: "Ideas" },
    { _id: "4", name: "Archived" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // const { data: prompts = [], isLoading } = useGetPrompts();

  const handleCreatePrompt = (name: string) => {
    // TODO: Implement prompt creation logic
    console.log("Creating prompt:", name);
  };

  return (
    <Sidebar className="hidden md:flex border-r bg-muted/40 min-w-[240px]">
      <SidebarContent className="flex flex-col h-full p-4 justify-between">
        <div>
          <SidebarGroup>
            {/* Logo */}
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
                <FileTextIcon size={20} /> YOUR PROMPTS
              </p>

              <SidebarMenu>
                {prompts.length === 0 && (
                  <p className="text-sm text-muted-foreground px-3">
                    No Prompts yet
                  </p>
                )}

                {isLoading ? (
                  <p className="text-sm text-muted-foreground px-3">
                    Loading prompts...
                  </p>
                ) : (
                  prompts.map((prompt) => {
                    const isActive = promptId === prompt._id;
                    const isHoveredOrOpen =
                      hoveredId === prompt._id || openDropdownId === prompt._id;

                    return (
                      <SidebarMenuItem
                        key={prompt._id}
                        onMouseEnter={() => setHoveredId(prompt._id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
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
                              href={`/prompts/${prompt._id}/versions`}
                              className="flex-1 truncate text-sm font-medium"
                            >
                              <span className="truncate">{prompt.name}</span>
                            </Link>

                            {isHoveredOrOpen && (
                              <DropdownMenu
                                onOpenChange={(open) => {
                                  setOpenDropdownId(open ? prompt._id : null);
                                }}
                              >
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 ml-auto"
                                  >
                                    <MoreVertical className="w-4 h-4" />
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
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}

                <SidebarMenuItem className="mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer text-sm"
                    onClick={() => setShowModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Prompt
                  </Button>
                </SidebarMenuItem>

                {/* Modal component */}
                <CreatePromptModal
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  onCreate={handleCreatePrompt}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
