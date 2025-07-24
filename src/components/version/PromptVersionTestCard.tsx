"use client";

import { Eye, FileText, Pencil, Zap } from "lucide-react";
import { useGetVersion, useToggleFavoriteVersion } from "@/lib/queries/version";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FavoriteButton from "../common/FavoriteButton";
import { SetActiveVersionButton } from "../common/SetActiveVersionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { estimateTokens } from "@/utils/tokeEstimate";
import { toast } from "sonner";
import { useEffect } from "react";

interface PromptVersionViewerProps {
  readonly versionId: string;
  readonly showTokenEstimate?: boolean;
  readonly onTokenEstimated?: (value: number) => void;
}

export function PromptVersionTestCard({
  versionId,
  showTokenEstimate = true,
  onTokenEstimated,
}: Readonly<PromptVersionViewerProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: version, isLoading } = useGetVersion(versionId);
  const { mutate: toggleFavorite, isPending } = useToggleFavoriteVersion();

  useEffect(() => {
    if (version?.content && onTokenEstimated) {
      const estimated = estimateTokens(version.content);
      onTokenEstimated(estimated);
    }
  }, [version?.content, onTokenEstimated]);

  if (isLoading || !version)
    return <Skeleton className="h-32 w-full rounded-lg" />;

  const handleToggleFavorite = () => {
    toggleFavorite(versionId, {
      onSuccess: () => toast.success("Toggled favorite"),
      onError: () => toast.error("Failed to toggle favorite"),
    });
  };

  const isInTestPage = pathname.includes("/test");
  const isInResponsePage = pathname.includes("/responses");
  const tokenCount = estimateTokens(version.content);

  return (
    <div className="border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Prompt Content - Version {version.versionNumber}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FavoriteButton
            isFavorite={version.isFavorite}
            isPending={isPending}
            onClick={handleToggleFavorite}
          />
          <SetActiveVersionButton
            versionId={version.id}
            promptId={version.promptId}
            isActive={version.isActive}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => router.back()}
          >
            <Pencil className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="py-3 px-4">
        <div className="max-h-48 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
            {version.content || "No content available"}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          {showTokenEstimate && version.content && (
            <p className="text-xs text-muted-foreground">
              ~{tokenCount} tokens
            </p>
          )}
        </div>

        <div className="flex gap-1">
          {isInTestPage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() =>
                router.push(pathname.replace("/test", "/responses"))
              }
            >
              <Eye className="w-3 h-3 mr-1" />
              Responses
            </Button>
          )}
          {isInResponsePage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() =>
                router.push(pathname.replace("/responses", "/test"))
              }
            >
              <Zap className="w-3 h-3 mr-1" />
              Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
