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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useDeleteFolder, useGetAllFolders } from "@/lib/queries/folder";
import { useParams, useRouter } from "next/navigation";

import { FolderCreateModal } from "../dashboard/FolderCreateModal";
import { FolderRenameModal } from "../dashboard/FolderRenameModal";
import Link from "next/link";
import { SidebarSkeletonItem } from "@/components/skeletons/SidebarSkeleton";
import { toast } from "sonner";
import { useGetPromptsByFolder } from "@/lib/queries/prompt";
import { useState } from "react";

export function SidebarFolderSection() {
  const { folderId, promptId } = useParams();
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [folderToRename, setFolderToRename] = useState<{
    _id: string;
    title: string;
  } | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const { data: folders = [], isLoading } = useGetAllFolders();
  const { mutate: deleteFolder, isPending: isDeleting } = useDeleteFolder();
  const router = useRouter();

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
    router.push(`/folders/${folderId}/prompts/${promptId}`);
  };

  const FolderPrompts = ({ folderId }: { folderId: string }) => {
    const { data: prompts = [], isLoading: isLoadingPrompts } =
      useGetPromptsByFolder(folderId);

    if (isLoadingPrompts) {
      return (
        <SidebarMenuSub>
          {Array.from({ length: 2 }).map((_, i) => (
            <SidebarMenuSubItem key={i}>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-3 w-3 bg-muted animate-pulse rounded" />
                <div className="h-3 flex-1 bg-muted animate-pulse rounded" />
              </div>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      );
    }

    if (prompts.length === 0) {
      return (
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <Link
              href={`/folders/${folderId}/prompts/new`}
              className="text-xs px-2 py-1 hover:text-primary text-muted-foreground"
            >
              + Add Prompt
            </Link>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      );
    }

    return (
      <SidebarMenuSub>
        {prompts.map((prompt: any) => (
          <SidebarMenuSubItem key={prompt._id}>
            <SidebarMenuSubButton
              asChild
              isActive={promptId === prompt._id}
              onClick={() => navigateToPrompt(folderId, prompt._id)}
            >
              <button className="flex items-center gap-2 w-full">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate text-xs">{prompt.title}</span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{prompt.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link
          href="/folders"
          className="flex items-center gap-2 hover:text-sidebar-accent-foreground transition-colors"
        >
          Folders
        </Link>
      </SidebarGroupLabel>

      <SidebarMenu>
        <div className="space-y-1">
          {(() => {
            if (isLoading) {
              return Array.from({ length: 3 }).map((_, i) => (
                <SidebarSkeletonItem key={i} />
              ));
            }

            if (folders.length === 0) {
              return (
                <div className="px-2 py-3">
                  <p className="text-xs text-muted-foreground">
                    No folders yet
                  </p>
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
                    <div className="flex items-center w-full group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolder(folder._id);
                        }}
                        className="flex-shrink-0 p-0.5 hover:bg-sidebar-accent rounded-sm transition-colors mr-1"
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
                        className="flex-1 min-w-0 pr-0"
                      >
                        <button
                          onClick={() => navigateToFolder(folder)}
                          className="flex items-center gap-2 w-full"
                        >
                          <Folder className="h-4 w-4 flex-shrink-0" />

                          <div className="flex items-center justify-between w-full min-w-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="truncate text-sm font-medium">
                                    {folder.title}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>{folder.title}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {promptCount > 0 && (
                              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">
                                {promptCount}
                              </span>
                            )}
                          </div>
                        </button>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            showOnHover
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem
                            onClick={() =>
                              setFolderToRename({
                                _id: folder._id,
                                title: folder.title,
                              })
                            }
                          >
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
                            <TrashIcon className="mr-2 h-4 w-4 text-destructive" />
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

        {/* Create Folder Modal with Button */}
        <SidebarMenuItem>
          <FolderCreateModal>
            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
              <Plus className="h-4 w-4" />
              <span>New Folder</span>
            </SidebarMenuButton>
          </FolderCreateModal>
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
          <AlertDialogContent
            onEscapeKeyDown={(e) => isDeleting && e.preventDefault()}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Delete folder?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the folder and{" "}
                <strong>all its prompts and versions</strong>. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={() =>
                  folderToDelete && handleDeleteFolder(folderToDelete)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Rename Folder Modal */}
      {folderToRename && (
        <FolderRenameModal
          folder={folderToRename}
          open={!!folderToRename}
          onClose={() => setFolderToRename(null)}
        />
      )}
    </SidebarGroup>
  );
}
