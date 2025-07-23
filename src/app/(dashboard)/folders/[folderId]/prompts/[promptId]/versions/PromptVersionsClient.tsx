"use client";

import { GitBranch, GitBranchIcon, PlusIcon } from "lucide-react";
import {
  useDeleteVersion,
  useGetAllVersions,
  useSetActiveVersion,
} from "@/lib/queries/version";
import { useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PromptVersionsSkeleton } from "@/components/skeletons/PromptVersionsSkeleton";
import { VersionCard } from "@/components/version/VersionCard";
import { toast } from "sonner";

interface Version {
  _id: string;
  ownerId: string;
  promptId: string;
  content: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function PromptVersionsClient() {
  const { promptId } = useParams();
  const pathname = usePathname();
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

      // Add a subtle highlight effect
      versionElement.style.transform = "scale(1.02)";
      versionElement.style.transition = "transform 0.2s ease-in-out";

      setTimeout(() => {
        versionElement.style.transform = "scale(1)";
      }, 200);
    }
  };

  if (versionsLoading) {
    return <PromptVersionsSkeleton />;
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <GitBranchIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No versions yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Create your first version to start managing different iterations of
          this prompt.
        </p>
        <Button asChild size="lg">
          <Link href={`${pathname}/new`}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create First Version
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Timeline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4">
        <div className="flex-shrink-0">
          <h2 className="text-xl font-semibold text-foreground">
            Version History
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and track all versions of this prompt
          </p>
        </div>

        {/* New Version Button */}
        <div className="flex-shrink-0">
          <Button asChild>
            <Link href={`${pathname}/new`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Version
            </Link>
          </Button>
        </div>
      </div>

      {/* Enhanced Timeline */}
      <div className="w-full">
        <div className="relative bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-lg border border-border/50 shadow-sm backdrop-blur-sm">
          {/* Timeline header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
            <GitBranch className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Timeline
            </span>
          </div>

          {/* Timeline content */}
          <div className="relative p-3">
            {/* Enhanced center line with gradient */}
            <div className="absolute inset-x-3 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

            {/* Enhanced edge fades */}
            <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background/90 via-background/60 to-transparent pointer-events-none z-10 rounded-l-lg" />
            <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background/90 via-background/60 to-transparent pointer-events-none z-10 rounded-r-lg" />

            {/* Scroll container */}
            <div className="overflow-x-auto relative z-20 scrollbar-none">
              <div className="flex items-center gap-4 px-2 py-1 min-w-max">
                {versions.map((version: Version, index: number) => {
                  const versionNumber = getVersionNumber(index);
                  const isActive = version.isActive;
                  const isFirst = index === versions.length - 1;
                  const isLast = index === 0;

                  return (
                    <div
                      key={version._id}
                      className="relative flex items-center"
                    >
                      {/* Connection line to previous version */}
                      {!isFirst && (
                        <div className="absolute -left-2 top-1/2 w-4 h-px bg-gradient-to-r from-border/40 to-border/20 transform -translate-y-1/2" />
                      )}

                      <button
                        onClick={() => scrollToVersion(version._id)}
                        className="relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded-full transition-all duration-300 group"
                        aria-label={`Jump to version ${versionNumber}`}
                      >
                        {/* Active version effects */}
                        {isActive && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse scale-150 blur-sm" />
                            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping scale-125" />
                          </>
                        )}

                        {/* Version node */}
                        <div
                          className={`relative z-10 flex items-center justify-center rounded-full border-2 font-semibold text-xs transition-all duration-300 ${
                            isActive
                              ? "w-7 h-7 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                              : "w-5 h-5 border-border bg-background text-muted-foreground hover:w-6 hover:h-6 hover:border-primary/60 hover:bg-primary/5 hover:text-primary hover:shadow-md group-hover:scale-110"
                          }`}
                        >
                          {versionNumber}
                        </div>
                      </button>

                      {/* Connection line to next version */}
                      {!isLast && (
                        <div className="absolute -right-2 top-1/2 w-4 h-px bg-gradient-to-r from-border/20 to-border/40 transform -translate-y-1/2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline footer with info */}
          <div className="px-3 py-1 border-t border-border/30 bg-muted/20">
            <div className="text-xs text-muted-foreground text-center">
              Click to navigate • {versions.length} version
              {versions.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Version Cards */}
      <div className="space-y-4">
        {versions.map((version: Version, index: number) => {
          const versionNumber = getVersionNumber(index);
          const isActive = version.isActive;

          return (
            <div
              key={version._id}
              className="relative"
              ref={(el) => {
                versionRefs.current[version._id] = el;
                if (isActive) {
                  activeVersionRef.current = el;
                }
              }}
            >
              <VersionCard
                version={version}
                versionNumber={versionNumber}
                promptId={promptId as string}
                onSetActive={handleSetActive}
                onDelete={handleDelete}
                isActivating={isActivating}
                isDeleting={isDeleting}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
