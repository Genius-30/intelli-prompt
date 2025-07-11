"use client";

import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { estimateTokens } from "@/utils/tokeEstimate";
import {
  Pencil,
  Star,
  StarOff,
  CheckCircle,
  Play,
  Eye,
  Zap,
} from "lucide-react";
import {
  useGetVersion,
  useSetActiveVersion,
  useToggleFavorite,
} from "@/lib/queries/version";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface PromptVersionViewerProps {
  readonly versionId: string;
  readonly showTokenEstimate?: boolean;
  readonly onTokenEstimated?: (value: number) => void;
}
export function PromptVersionViewer({
  versionId,
  showTokenEstimate = true,
  onTokenEstimated,
}: Readonly<PromptVersionViewerProps>) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ to detect current route
  const { data: version, isLoading } = useGetVersion(versionId);
  const toggleFavorite = useToggleFavorite();
  const setActiveVersion = useSetActiveVersion(
    version?.folderId || "",
    versionId
  );

  useEffect(() => {
    if (version?.content && onTokenEstimated) {
      const estimated = estimateTokens(version.content);
      onTokenEstimated(estimated);
    }
  }, [version?.content, onTokenEstimated]);

  if (isLoading || !version)
    return <Skeleton className="h-24 w-full rounded-md" />;

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(versionId, {
      onSuccess: () => toast.success("Toggled favorite"),
      onError: () => toast.error("Failed to toggle favorite"),
    });
  };

  const handleSetActive = () => {
    if (version.isCurrent) {
      toast.info("This prompt version is already active");
      return;
    }
    setActiveVersion.mutate(
      { versionId, folderId: version.folderId },
      {
        onSuccess: () => toast.success("Set as active"),
        onError: () => toast.error("Failed to set active"),
      }
    );
  };

  const isInTestPage = pathname.includes("/test");
  const isInResponsePage = pathname.includes("/responses");

  return (
    <div className="border border-sidebar-primary rounded-md p-4 bg-primary/10 relative space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-2">Prompt</h2>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={cn(
              "hover:text-yellow-500 cursor-pointer",
              version.isFavorite && "text-yellow-500"
            )}
            title={version.isFavorite ? "Unfavorite" : "Favorite"}
          >
            {version.isFavorite ? (
              <Star className="w-5 h-5 fill-yellow-400" />
            ) : (
              <StarOff className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSetActive}
            title={version.isCurrent ? "Active Version" : "Set as Active"}
          >
            <CheckCircle
              className={`w-5 h-5 ${
                version.isCurrent ? "text-green-500" : "text-muted-foreground"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/prompts/${version.folderId}/versions/${versionId}`)
            }
            title="Edit Prompt"
          >
            <Pencil className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-sm">
        {version.content || "No content available"}
      </p>

      {showTokenEstimate && version.content && (
        <p className="text-xs text-muted-foreground mt-2">
          Estimated Tokens: {estimateTokens(version.content)}
        </p>
      )}

      {/* Action Button (Conditional) */}
      <div className="pt-2">
        {isInTestPage && (
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/prompts/${version.folderId}/versions/${versionId}/responses`
              )
            }
          >
            <Eye className="w-4 h-4" />
            View Responses
          </Button>
        )}

        {isInResponsePage && (
          <Button
            onClick={() =>
              router.push(
                `/prompts/${version.folderId}/versions/${versionId}/test`
              )
            }
          >
            <Zap className="w-4 h-4" />
            Test Prompt
          </Button>
        )}
      </div>
    </div>
  );
}
