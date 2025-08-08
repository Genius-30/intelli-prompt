"use client";

import { Eye, FileText, Pencil, Share, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetVersion, useToggleFavoriteVersion } from "@/lib/queries/version";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import FavoriteButton from "../common/FavoriteButton";
import { SetActiveVersionButton } from "../common/SetActiveVersionButton";
import { SharePromptModal } from "../sharedPrompt/SharePromptModal";
import { Skeleton } from "@/components/ui/skeleton";
import { estimateTokens } from "@/utils/tokeEstimate";
import { toast } from "sonner";

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
  const { folderId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data: version, isLoading } = useGetVersion(versionId);
  const { mutate: toggleFavorite, isPending } = useToggleFavoriteVersion();

  useEffect(() => {
    if (version?.content && onTokenEstimated) {
      const estimated = estimateTokens(version.content);
      onTokenEstimated(estimated);
    }
  }, [version?.content, onTokenEstimated]);

  if (isLoading || !version) return <Skeleton className="h-32 w-full rounded-lg" />;

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
    <div className="rounded-lg border">
      {/* Header */}
      <div className="bg-muted/30 flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-3 w-3" />
          <span className="text-muted-foreground text-xs">
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
            versionId={versionId}
            promptId={version.promptId}
            isActive={version.isActive}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/folders/${folderId}/prompts/${version.promptId}/versions/${versionId}`)
            }
            title="Edit Prompt"
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShareModalOpen(true)}
            title="Share Prompt"
          >
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <div className="max-h-48 overflow-y-auto">
          <pre className="text-sm leading-relaxed whitespace-pre-wrap">
            {version.content || "No content available"}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/30 flex items-center justify-between border-t px-3 py-2">
        <div className="flex items-center gap-2">
          {showTokenEstimate && version.content && (
            <p className="text-muted-foreground text-xs">~{tokenCount} tokens</p>
          )}
        </div>

        <div className="flex gap-1">
          {isInTestPage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => router.push(pathname.replace("/test", "/responses"))}
            >
              <Eye className="mr-1 h-3 w-3" />
              Responses
            </Button>
          )}
          {isInResponsePage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => router.push(pathname.replace("/responses", "/test"))}
            >
              <Zap className="mr-1 h-3 w-3" />
              Test
            </Button>
          )}
        </div>
      </div>

      {/* Share Prompt Modal */}
      <SharePromptModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        promptContent={version.content}
        versionId={version._id}
      />
    </div>
  );
}
