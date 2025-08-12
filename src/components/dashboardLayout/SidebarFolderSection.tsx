"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  ChevronRight,
  Edit2Icon,
  FileText,
  Folder,
  MoreVertical,
  Plus,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  useCreateFolder,
  useDeleteFolder,
  useGetAllFolders,
  useRenameFolder,
} from "@/lib/queries/folder";
import { useParams, useRouter } from "next/navigation";

import { FolderCreateModal } from "@/components/dashboardLayout/FolderCreateModal";
import Link from "next/link";
import { SidebarSkeletonItem } from "@/components/skeletons/SidebarSkeleton";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { useGetPromptsByFolder } from "@/lib/queries/prompt";
import { useState } from "react";

export function SidebarFolderSection() {
  const { folderId, promptId } = useParams();
  const [modalState, setModalState] = useState<{
    type: "create" | "rename" | null;
    folder?: { _id: string; title: string };
  }>({ type: null });
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const { data: folders = [], isLoading } = useGetAllFolders();
  const { mutate: createFolder, isPending: isCreating } = useCreateFolder();
  const { mutate: renameFolder, isPending: isRenaming } = useRenameFolder();
  const { mutate: deleteFolder, isPending: isDeleting } = useDeleteFolder();
  const router = useRouter();

  const openCreateModal = () => setModalState({ type: "create" });
  const openRenameModal = (folder: { _id: string; title: string }) =>
    setModalState({ type: "rename", folder });
  const closeModal = () => setModalState({ type: null });

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id, {
      onSuccess: () => {
        toast.success("Folder deleted");
        if (folderId === id) router.push("/folders");
        setDialogOpen(false);
        setFolderToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete folder");
        setDialogOpen(false);
        setFolderToDelete(null);
      },
    });
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const navigateToFolder = (folder: any) => {
    router.push(`/folders/${folder._id}/prompts`);
  };

  const navigateToPrompt = (folderId: string, promptId: string) => {
    router.push(`/folders/${folderId}/prompts/${promptId}/versions`);
  };

  const FolderPrompts = ({ folderId }: { folderId: string }) => {
    const { data: prompts = [], isLoading: isLoadingPrompts } = useGetPromptsByFolder(folderId);

    if (isLoadingPrompts) {
      return (
        <SidebarMenuSub className="gap-2 py-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1 px-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1 rounded" />
            </div>
          ))}
        </SidebarMenuSub>
      );
    }

    return (
      <SidebarMenuSub className="mr-0 w-full pr-3">
        {prompts.map((prompt: any) => (
          <SidebarMenuSubItem key={prompt._id}>
            <SidebarMenuSubButton
              asChild
              isActive={promptId === prompt._id}
              onClick={() => navigateToPrompt(folderId, prompt._id)}
              className="w-full"
            >
              <div className="flex w-full cursor-pointer items-center gap-2">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <p className="truncate">{prompt.title}</p>
              </div>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
        <SidebarMenuSubItem>
          <Link
            href={`/folders/${folderId}/prompts/new`}
            className="hover:text-primary text-muted-foreground px-2 py-1 text-xs"
          >
            + Add Prompt
          </Link>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link
          href="/folders"
          className="hover:text-sidebar-accent-foreground flex items-center gap-2 transition-colors"
        >
          Folders
        </Link>
      </SidebarGroupLabel>

      <SidebarMenu>
        <div className="space-y-1">
          {(() => {
            if (isLoading) {
              return Array.from({ length: 3 }).map((_, i) => <SidebarSkeletonItem key={i} />);
            }

            if (folders.length === 0) {
              return (
                <div className="px-2 py-3">
                  <p className="text-muted-foreground text-xs">No folders yet</p>
                </div>
              );
            }

            return folders.map((folder: any) => {
              const isActive = folderId === folder._id;
              const isExpanded = expandedFolders.has(folder._id);
              const promptCount = folder.promptCount || 0;

              return (
                <div key={folder._id}>
                  <SidebarMenuItem>
                    <div className="group flex w-full items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolder(folder._id);
                        }}
                        className="hover:bg-sidebar-accent mr-1 flex-shrink-0 rounded-sm p-0.5 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>

                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="min-w-0 flex-1 pr-0"
                      >
                        <button
                          onClick={() => navigateToFolder(folder)}
                          className="flex w-full items-center gap-2"
                        >
                          <Folder className="h-4 w-4 flex-shrink-0 fill-current" />

                          <div className="flex w-full min-w-0 items-center justify-between">
                            <p className="truncate">{folder.title}</p>

                            {promptCount > 0 && (
                              <span className="text-muted-foreground ml-2 flex-shrink-0 rounded-full px-1.5 py-0.5 text-xs">
                                {promptCount}
                              </span>
                            )}
                          </div>
                        </button>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            showOnHover
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem onClick={() => openRenameModal(folder)}>
                            <Edit2Icon className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setFolderToDelete(folder._id);
                              setDialogOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <TrashIcon className="text-destructive mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>

                  {/* Collapsible Prompts List */}
                  {isExpanded && (
                    <div className="ml-4">
                      <FolderPrompts folderId={folder._id} />
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>

        {/* Add New Folder Button */}
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={openCreateModal}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            <span>New Folder</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Delete Confirmation Dialog */}
      {folderToDelete && (
        <AlertDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setDialogOpen(false);
              setFolderToDelete(null);
            }
          }}
        >
          <AlertDialogContent onEscapeKeyDown={(e) => isDeleting && e.preventDefault()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete folder?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the folder and{" "}
                <strong>all its prompts and versions</strong>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting} onClick={() => setDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={() => folderToDelete && handleDeleteFolder(folderToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Folder Creation/Rename Modal */}
      {modalState.type && (
        <FolderCreateModal
          open={true}
          onClose={closeModal}
          defaultTitle={modalState.type === "rename" ? modalState.folder?.title : ""}
          submitText={modalState.type === "rename" ? "Rename" : "Create"}
          isPending={modalState.type === "rename" ? isRenaming : isCreating}
          onSubmit={(title) => {
            if (modalState.type === "create") {
              createFolder(title, {
                onSuccess: (data) => {
                  const newId = data?._id;
                  if (newId) {
                    router.push(`/folders/${newId}/prompts`);
                    // Auto-expand the newly created folder
                    setExpandedFolders((prev) => new Set([...prev, newId]));
                  }
                  toast.success("Folder created");
                },
                onError: () => toast.error("Failed to create folder"),
              });
            } else if (modalState.type === "rename" && modalState.folder) {
              renameFolder(
                { _id: modalState.folder._id, title },
                {
                  onSuccess: () => toast.success("Folder renamed"),
                  onError: () => toast.error("Failed to rename folder"),
                },
              );
            }
            closeModal();
          }}
        />
      )}
    </SidebarGroup>
  );
}
