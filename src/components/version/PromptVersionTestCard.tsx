"use client";

import { Clock, Eye, FileText, Pencil, Zap } from "lucide-react";
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
    return <Skeleton className="h-32 w-full rounded-xl" />;

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
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Prompt Content</h2>
              <p className="text-sm text-muted-foreground">
                Version {version.versionNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              onClick={() => router.back()}
              className="hover:bg-primary/10"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="max-h-48 overflow-y-auto rounded-lg bg-background/50 p-4 border">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {version.content || "No content available"}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            {showTokenEstimate && version.content && (
              <Badge variant="secondary" className="text-xs">
                ~{tokenCount} tokens
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isInTestPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(pathname.replace("/test", "/responses"))
                }
                className="hover:bg-primary/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Responses
              </Button>
            )}
            {isInResponsePage && (
              <Button
                size="sm"
                onClick={() =>
                  router.push(pathname.replace("/responses", "/test"))
                }
              >
                <Zap className="w-4 h-4 mr-2" />
                Test Prompt
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
