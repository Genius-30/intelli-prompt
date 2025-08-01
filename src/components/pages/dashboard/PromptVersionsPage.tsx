"use client";

import { GitBranch, PlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PromptVersionsSkeleton } from "@/components/skeletons/PromptVersionsSkeleton";
import { Version } from "@/types/version";
import { VersionCard } from "@/components/version/VersionCard";
import { VersionLegend } from "@/components/version/VersionLegend";
import { useGetAllVersions } from "@/lib/queries/version";

export function PromptVersionsPage() {
  const { folderId, promptId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeVersionRef = useRef<HTMLDivElement | null>(null);
  const versionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: versions, isLoading: versionsLoading } = useGetAllVersions(promptId as string);

  const activeVersion = versions?.find((v: Version) => v.isActive);
  const activeVersionId = activeVersion?._id;

  const latestVersion = versions?.reduce((latest: Version, current: Version) => {
    return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
  });

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
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
          <GitBranch className="text-muted-foreground h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No versions yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md text-center text-sm">
          You haven't created a prompt yet. Create your first prompt to start managing versions.
        </p>
        <Button onClick={() => router.push(`/folders/${folderId}/prompts/new`)}>
          <PlusIcon className="h-4 w-4" />
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
          <p className="text-muted-foreground text-sm">Manage all versions of this prompt</p>
        </div>

        <div className="flex items-center gap-3">
          <VersionLegend />
          {activeVersionId && (
            <Button onClick={() => router.push(`${pathname}/${activeVersionId}`)}>
              <PlusIcon className="h-4 w-4" />
              New Version
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="bg-muted/30 flex items-center gap-2 border-b px-3 py-2">
          <GitBranch className="text-muted-foreground h-3 w-3" />
          <span className="text-muted-foreground text-xs">Timeline</span>
        </div>

        <div className="p-3">
          <div className="relative">
            <div className="bg-border absolute inset-x-0 top-1/2 h-px" />
            <div className="overflow-x-auto">
              <div className="flex min-w-max items-center gap-3">
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
                      className="focus:ring-primary/50 relative flex-shrink-0 rounded-full transition-colors focus:ring-2 focus:outline-none"
                      aria-label={`Jump to version ${versionNumber}`}
                    >
                      <div
                        className={`bg-background relative z-10 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium transition-colors ${getNodeColor()}`}
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

        <div className="bg-muted/30 border-t px-3 py-2">
          <div className="text-muted-foreground text-center text-xs">
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
              <VersionCard version={version} isLatest={isLatest} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
