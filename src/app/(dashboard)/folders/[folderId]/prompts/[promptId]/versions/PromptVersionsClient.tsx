"use client";

import {
  CheckIcon,
  GitBranchIcon,
  MoreVertical,
  PlusIcon,
  SquarePenIcon,
  Star,
  TrashIcon,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteVersion,
  useGetAllVersions,
  useSetActiveVersion,
} from "@/lib/queries/version";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { VersionsSkeleton } from "@/components/skeletons/VersionsSkeleton";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useGetPromptMeta } from "@/lib/queries/folder";
import { useParams } from "next/navigation";

interface Version {
  _id: string;
  version: string;
  updatedAt: string | Date;
  isCurrent: boolean;
  isFavorite: boolean;
  content: string;
}

export function PromptVersionsClient() {
  const { promptId } = useParams();
  const activeVersionRef = useRef<HTMLDivElement | null>(null);

  const { data: promptMeta, isLoading } = useGetPromptMeta(promptId as string);
  const { data: versions = [], isLoading: versionsLoading } = useGetAllVersions(
    promptId as string
  );
  const { mutate: deleteVersion, isPending: isDeleting } = useDeleteVersion(
    promptId as string
  );
  const { mutate: setActiveVersion, isPending: isActivating } =
    useSetActiveVersion(promptId as string);

  useEffect(() => {
    if (activeVersionRef.current) {
      activeVersionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [versionsLoading]);

  return (
    <div className="sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[240px]" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">
                {promptMeta?.title ?? "Prompt Versions"}
              </h1>
              <p className="text-muted-foreground text-sm">
                View and manage all versions of this prompt
              </p>
            </>
          )}
        </div>
      </div>

      {/* Timeline */}
      {(() => {
        if (versionsLoading) {
          return (
            <>
              <VersionsSkeleton />
              <VersionsSkeleton />
              <VersionsSkeleton />
            </>
          );
        }

        if (versions.length === 0) {
          return (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-sm mb-4">
                No versions available yet.
              </p>
              <Button asChild>
                <Link href={`/prompts/${promptId}/versions/new`}>
                  <PlusIcon className="w-4 h-4" /> Create Version
                </Link>
              </Button>
            </div>
          );
        }

        return (
          <div className="relative border-l border-muted pl-6 max-h-[calc(100vh-150px)] overflow-y-auto sm:pr-4">
            {versions.map((version: Version, index: number) => (
              <div
                key={version._id}
                ref={version.isCurrent ? activeVersionRef : null}
                className="relative pb-10 group"
              >
                {index < versions.length - 1 && (
                  <span className="absolute left-[-1px] top-6 h-full w-px bg-muted z-0" />
                )}
                <span className="absolute -left-[8px] top-[8px] z-10">
                  {version.isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
                  )}
                  <span
                    className={`relative block w-4 h-4 ${
                      version.isCurrent ? "bg-primary" : "bg-background"
                    } border-2 border-primary rounded-full`}
                  />
                </span>

                <div className="pl-6 pr-4 pt-2 pb-3 bg-background rounded-lg shadow-sm border border-muted relative z-10 ml-4 sm:ml-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-base font-medium">
                      <GitBranchIcon className="w-4 h-4" />v{version.version}
                      {version.isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                      {version.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {!version.isCurrent && (
                          <DropdownMenuItem
                            onClick={() =>
                              setActiveVersion(
                                {
                                  versionId: version._id,
                                  folderId: promptId as string,
                                },
                                {
                                  onSuccess: () =>
                                    toast.success("Set as active."),
                                  onError: () =>
                                    toast.error("Failed to set active."),
                                }
                              )
                            }
                            disabled={isActivating}
                          >
                            <CheckIcon className="w-4 h-4 mr-1" /> Set as Active
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            deleteVersion(version._id, {
                              onSuccess: () =>
                                toast.success("Version deleted."),
                              onError: () =>
                                toast.error("Failed to delete version."),
                            })
                          }
                          disabled={isDeleting}
                          className="text-red-600"
                        >
                          <TrashIcon className="text-red-600 w-4 h-4 mr-1" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {version.content}
                  </p>

                  <div className="flex justify-between items-center mt-5">
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(version.updatedAt))}{" "}
                      ago
                    </p>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="px-3"
                      >
                        <Link
                          href={`/prompts/${promptId}/versions/${version._id}`}
                        >
                          <SquarePenIcon className="w-4 h-4 mr-1" /> Edit
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="default"
                        className="px-3"
                      >
                        <Link
                          href={`/prompts/${promptId}/versions/${version._id}/test`}
                        >
                          <Zap className="w-4 h-4" /> Test
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
