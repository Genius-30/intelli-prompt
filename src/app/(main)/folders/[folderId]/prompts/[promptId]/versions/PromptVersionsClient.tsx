"use client";

import { GitBranch, PlusIcon } from "lucide-react";
import {
  useDeleteVersion,
  useGetAllVersions,
  useSetActiveVersion,
} from "@/lib/queries/version";
import { useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PromptVersionsSkeleton } from "@/components/skeletons/PromptVersionsSkeleton";
import { VersionCard } from "@/components/version/VersionCard";
import { VersionLegend } from "@/components/version/VersionLegend";
import { toast } from "sonner";

interface Version {
  _id: string;
  ownerId: string;
  promptId: string;
  versionNumber: number;
  content: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function PromptVersionsClient() {
  const { folderId, promptId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeVersionRef = useRef<HTMLDivElement | null>(null);
  const versionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: versions, isLoading: versionsLoading } = useGetAllVersions(
    promptId as string
  );

  const { mutate: deleteVersion, isPending: isDeleting } = useDeleteVersion(
    promptId as string
  );
  const { mutate: setActiveVersion, isPending: isActivating } =
    useSetActiveVersion();

  const activeVersion = versions?.find((v: Version) => v.isActive);
  const activeVersionId = activeVersion?._id;

  const latestVersion = versions?.reduce(
    (latest: Version, current: Version) => {
      return new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest;
    }
  );

  useEffect(() => {
    if (activeVersionRef.current && !versionsLoading) {
      setTimeout(() => {
        activeVersionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [versionsLoading]);

  const getVersionNumber = (index: number) => versions.length - index;

  const handleSetActive = (versionId: string) => {
    setActiveVersion(
      {
        versionId,
        promptId: promptId as string,
      },
      {
        onSuccess: () => toast.success("Version set as active"),
        onError: () => toast.error("Failed to set as active"),
      }
    );
  };

  const handleDelete = (versionId: string) => {
    deleteVersion(versionId, {
      onSuccess: () => toast.success("Version deleted"),
      onError: () => toast.error("Failed to delete version"),
    });
  };

  const scrollToVersion = (versionId: string) => {
    const versionElement = versionRefs.current[versionId];
    if (versionElement) {
      versionElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  if (versionsLoading) {
    return <PromptVersionsSkeleton />;
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
          <GitBranch className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No versions yet</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
          You haven't created a prompt yet. Create your first prompt to start
          managing versions.
        </p>
        <Button onClick={() => router.push(`/folders/${folderId}/prompts/new`)}>
          <PlusIcon className="w-4 h-4" />
          Create Prompt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Version History</h2>
          <p className="text-sm text-muted-foreground">
            Manage all versions of this prompt
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VersionLegend />
          {activeVersionId && (
            <Button
              onClick={() => router.push(`${pathname}/${activeVersionId}`)}
            >
              <PlusIcon className="w-4 h-4" />
              New Version
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          <GitBranch className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Timeline</span>
        </div>

        <div className="p-3">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <div className="overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max">
                {versions.map((version: Version, index: number) => {
                  const versionNumber = getVersionNumber(index);
                  const isActive = version.isActive;
                  const isFavorite = version.isFavorite;
                  const isLatest = latestVersion?._id === version._id;

                  const getNodeColor = () => {
                    if (isLatest) return "border-emerald-500 text-white";
                    if (isActive) return "border-blue-500 text-white";
                    if (isFavorite) return "border-amber-500 text-white";
                    return "border-border text-muted-foreground hover:border-muted-foreground";
                  };

                  return (
                    <button
                      key={version._id}
                      onClick={() => scrollToVersion(version._id)}
                      className="relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full transition-colors"
                      aria-label={`Jump to version ${versionNumber}`}
                    >
                      <div
                        className={`relative z-10 flex items-center justify-center w-6 h-6 bg-background rounded-full border text-xs font-medium transition-colors ${getNodeColor()}`}
                      >
                        {versionNumber}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground text-center">
            {versions.length} version{versions.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {versions.map((version: Version, index: number) => {
          const isActive = version.isActive;
          const isLatest = latestVersion?._id === version._id;

          return (
            <div
              key={version._id}
              ref={(el) => {
                versionRefs.current[version._id] = el;
                if (isActive) {
                  activeVersionRef.current = el;
                }
              }}
            >
              <VersionCard
                version={version}
                onSetActive={handleSetActive}
                onDelete={handleDelete}
                isActivating={isActivating}
                isDeleting={isDeleting}
                isLatest={isLatest}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
