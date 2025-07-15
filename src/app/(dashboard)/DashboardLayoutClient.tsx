"use client";

import {
  Plus,
  MoreVertical,
  LayoutDashboardIcon,
  CreditCardIcon,
  Edit2Icon,
  TrashIcon,
  Star,
  TrophyIcon,
  BookmarkIcon,
  UsersIcon,
  UserIcon,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
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
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import Logo from "../../components/Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PromptModal } from "../../components/prompt/PromptModal";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useCreatePrompt,
  useGetAllPrompts,
  useRenamePrompt,
  useDeletePrompt,
} from "@/lib/queries/prompt";
import { toast } from "sonner";
import { SidebarSkeletonItem } from "../../components/skeletons/SidebarSkeleton";
import { BreadcrumbResponsive } from "../../components/BreadCrumbResponsive";
import { ModeToggle } from "../../components/ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { promptId } = useParams();
  const [modalState, setModalState] = useState<{
    type: "create" | "rename" | null;
    prompt?: { _id: string; title: string };
  }>({ type: null });
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { data: prompts = [], isLoading } = useGetAllPrompts();
  const { mutate: createPrompt, isPending: isCreating } = useCreatePrompt();
  const { mutate: renamePrompt, isPending: isRenaming } = useRenamePrompt();
  const { mutate: deletePrompt, isPending: isDeleting } = useDeletePrompt();

  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const router = useRouter();

  const openCreateModal = () => setModalState({ type: "create" });
  const openRenameModal = (prompt: {
    _id: string;
    title: string;
    isFavorite: boolean;
  }) => setModalState({ type: "rename", prompt });

  const closeModal = () => setModalState({ type: null });

  const handleDeletePrompt = (id: string) => {
    deletePrompt(id, {
      onSuccess: () => {
        toast.success("Prompt deleted");
        if (promptId === id) router.push("/prompts");
        setDialogOpen(false);
        setPromptToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete prompt");
        setDialogOpen(false); // or keep open for retry
        setPromptToDelete(null);
      },
    });
  };

  let promptContent: React.ReactNode;

  if (isLoading) {
    promptContent = Array.from({ length: 3 }).map((_, i) => (
      <SidebarSkeletonItem key={i} />
    ));
  } else if (prompts.length === 0) {
    promptContent = (
      <p className="text-sm text-muted-foreground ml-3 my-2">No Prompts yet!</p>
    );
  } else {
    promptContent = prompts.map(
      (prompt: { _id: string; title: string; isFavorite: boolean }) => {
        const isActive = promptId === prompt._id;
        const isHoveredOrOpen =
          isMobile || hoveredId === prompt._id || openDropdownId === prompt._id;

        return (
          <SidebarMenuItem
            key={prompt._id}
            onMouseEnter={() => setHoveredId(prompt._id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              "rounded-md overflow-hidden",
              isActive && "bg-primary/10"
            )}
          >
            <SidebarMenuButton asChild className="w-full px-2 py-1">
              <div
                className={cn(
                  "flex items-center justify-between w-full text-sm font-medium rounded-md px-2 py-1 transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Link
                  href={`/prompts/${prompt._id}/versions`}
                  className="flex-1 truncate flex items-center gap-2"
                >
                  <span className="truncate max-w-[85%]">{prompt.title}</span>
                  {prompt.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                  )}
                </Link>

                {isHoveredOrOpen && (
                  <DropdownMenu
                    onOpenChange={(open) => {
                      setOpenDropdownId(open ? prompt._id : null);
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-6 h-6">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openRenameModal(prompt)}>
                        <Edit2Icon className="mr-2 h-4 w-4" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPromptToDelete(prompt._id);
                          setDialogOpen(true);
                          setOpenDropdownId(null);
                        }}
                        className="text-red-600"
                      >
                        <TrashIcon className="text-red-600 mr-2 h-4 w-4" />{" "}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="px-2 py-2">
            <Logo />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup key="main">
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
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

                {/* Explore */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/explore"
                      className={cn(
                        "text-sm font-medium w-full text-left",
                        pathname === "/explore"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <UsersIcon size={20} /> Explore
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Leaderboard */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/leaderboard"
                      className={cn(
                        "text-sm font-medium w-full text-left",
                        pathname === "/leaderboard"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <TrophyIcon size={20} /> Leaderboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Saved */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/saved"
                      className={cn(
                        "text-sm font-medium w-full text-left",
                        pathname === "/saved"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <BookmarkIcon size={20} /> Saved
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
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup key="prompts">
            <SidebarGroupLabel>
              <Link
                href="/prompts"
                className=" flex items-center gap-2 cursor-pointer"
              >
                Folders
              </Link>
            </SidebarGroupLabel>

            <SidebarMenu>
              <div className="max-h-[200px] space-y-0.5 pr-1 overflow-y-auto custom-scroll">
                {promptContent}
              </div>

              <SidebarMenuItem className="mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer text-sm"
                  onClick={openCreateModal}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Prompt
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Delete Prompt Confirmation Dialog */}
            {promptToDelete && (
              <AlertDialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  if (!open) setPromptToDelete(null);
                }}
              >
                <AlertDialogContent
                  onEscapeKeyDown={(e) => isDeleting && e.preventDefault()}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the prompt and{" "}
                      <strong>all its versions</strong>. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={isDeleting}
                      onClick={() => {
                        if (!isDeleting) {
                          setDialogOpen(false);
                          setPromptToDelete(null);
                        }
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleting}
                      onClick={() => {
                        if (!promptToDelete) return;
                        handleDeletePrompt(promptToDelete);
                      }}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Prompt Modal */}
            {modalState.type && (
              <PromptModal
                open={true}
                onClose={closeModal}
                defaultTitle={
                  modalState.type === "rename" ? modalState.prompt?.title : ""
                }
                submitText={modalState.type === "rename" ? "Rename" : "Create"}
                isPending={
                  modalState.type === "rename" ? isRenaming : isCreating
                }
                onSubmit={(title) => {
                  if (modalState.type === "create") {
                    createPrompt(title, {
                      onSuccess: (data) => {
                        const newId = data?._id;
                        if (newId) {
                          router.push(`/prompts/${newId}/versions`);
                        }
                      },
                      onError: () => toast.error("Failed to create prompt"),
                    });
                  } else if (
                    modalState.type === "rename" &&
                    modalState.prompt
                  ) {
                    renamePrompt({
                      _id: modalState.prompt._id,
                      title,
                    });
                  }
                  closeModal();
                }}
              />
            )}
          </SidebarGroup>
        </SidebarContent>

        {/* User Public Profile */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/profile"
                  className={cn(
                    "text-sm font-medium w-full text-left",
                    pathname === "/profile"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UserIcon size={20} /> Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />

          <div className="flex flex-1 items-center justify-between gap-2">
            <BreadcrumbResponsive />

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <ModeToggle />
              <Badge className="text-xs mr-3">Pro</Badge>
              <UserButton
                appearance={{
                  baseTheme: resolvedTheme === "dark" ? dark : undefined,
                }}
              />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
