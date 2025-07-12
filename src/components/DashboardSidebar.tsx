"use client";

import {
  Plus,
  MoreVertical,
  LayoutDashboardIcon,
  CreditCardIcon,
  FileTextIcon,
  Edit2Icon,
  TrashIcon,
  Star,
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
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PromptModal } from "./prompt/PromptModal";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useCreatePrompt,
  useGetAllPrompts,
  useRenamePrompt,
  useDeletePrompt,
} from "@/lib/queries/prompt";
import { toast } from "sonner";
import { SidebarSkeletonItem } from "./skeletons/SidebarSkeletin";

export function DashboardSidebar() {
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
                  className="flex-1 truncate text-sm font-medium flex items-center justify-between gap-1 sm:pr-2"
                >
                  <span className="truncate">{prompt.title}</span>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 ml-auto"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openRenameModal(prompt)}>
                        <Edit2Icon /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPromptToDelete(prompt._id);
                          setDialogOpen(true);
                          setOpenDropdownId(null);
                        }}
                        className="text-red-600"
                      >
                        <TrashIcon className="text-red-600" /> Delete
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
                {/* <FileTextIcon size={18} /> */}
                YOUR PROMPTS
              </p>

              <SidebarMenu>
                {promptContent}

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
                          <strong>all its versions</strong>. This action cannot
                          be undone.
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

                {/* Prompt Modal */}
                {modalState.type && (
                  <PromptModal
                    open={true}
                    onClose={closeModal}
                    defaultTitle={
                      modalState.type === "rename"
                        ? modalState.prompt?.title
                        : ""
                    }
                    submitText={
                      modalState.type === "rename" ? "Rename" : "Create"
                    }
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
