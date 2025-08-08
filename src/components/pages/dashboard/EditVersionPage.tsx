"use client";

import { AlertTriangle, Plus, Redo2Icon, Share, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useAddVersion,
  useGetVersion,
  useToggleFavoriteVersion,
  useUpdateVersion,
} from "@/lib/queries/version";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import EditVersionSkeleton from "@/components/skeletons/EditVersionSkeleton";
import FavoriteButton from "@/components/common/FavoriteButton";
import { Loader } from "@/components/ui/loader";
import { PromptContentInput } from "@/components/version/PromptContentInput";
import { PromptEnhancer } from "@/components/prompt/PromptEnhancer";
import type React from "react";
import { SetActiveVersionButton } from "@/components/common/SetActiveVersionButton";
import { SharePromptModal } from "@/components/sharedPrompt/SharePromptModal";
import { estimateTokens } from "@/utils/tokeEstimate";
import { toast } from "sonner";

type VersionData = {
  _id: string;
  promptId: string;
  version: number;
  content: string;
  isActive: boolean;
  isCurrent: boolean;
  isFavorite: boolean;
};

export default function EditVersionPage() {
  const { versionId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: initialData,
    isPending,
    isError,
  } = useGetVersion(versionId as string) as {
    data: VersionData | undefined;
    isPending: boolean;
    isError: boolean;
  };

  const [content, setContent] = useState("");
  const [tokenEstimated, setTokenEstimated] = useState(100);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { mutateAsync: updateVersion, isPending: isUpdating } = useUpdateVersion();
  const { mutateAsync: addPromptVersion, isPending: isAdding } = useAddVersion();
  const { mutate: toggleFavorite, isPending: isToggling } = useToggleFavoriteVersion();

  useEffect(() => {
    if (initialData?.content) {
      setContent(initialData.content);
      setTokenEstimated(estimateTokens(initialData.content));
    }
  }, [initialData]);

  const isPromptValid = content.trim().length > 0;
  const isUnchanged = initialData && content.trim() === initialData.content.trim();
  const disableSaveButton = !isPromptValid || isUnchanged;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }
    try {
      await updateVersion({ versionId: versionId as string, content });
      toast.success("Prompt updated successfully!");
      router.back();
    } catch (error) {
      console.error("Update Version Error:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleReplacePrompt = (enhanced: string) => {
    setContent(enhanced);
    setTokenEstimated(estimateTokens(enhanced));
  };

  if (isPending) {
    return <EditVersionSkeleton />;
  }

  if (isError || !initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Failed to load version</h3>
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          Something went wrong while loading the version. Please try again.
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          <Redo2Icon className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Version Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xl font-semibold">Version {initialData.version}</p>
            {!initialData.isActive && (
              <p className="text-muted-foreground text-sm">This is not the active version.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SetActiveVersionButton
              versionId={initialData._id}
              promptId={initialData.promptId}
              isActive={initialData.isActive}
            />
            <FavoriteButton
              isFavorite={initialData.isFavorite}
              isPending={isToggling}
              onClick={() => toggleFavorite(initialData._id)}
            />
            <Button variant="secondary" onClick={() => setIsShareModalOpen(true)} className="gap-2">
              Share
              <Share className="h-3 w-3" />
            </Button>
            <Button type="button" variant="default" onClick={() => router.push(`${pathname}/test`)}>
              Test
              <Zap className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content + Enhancer */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <div className="h-full min-h-[300px]">
            <PromptContentInput
              value={content}
              onChange={(val) => setContent(val)}
              tokenEstimated={tokenEstimated}
              setTokenEstimated={setTokenEstimated}
            />
            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {disableSaveButton ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block">
                      <Button
                        type="button"
                        variant="outline"
                        disabled
                        className="pointer-events-none bg-transparent"
                      >
                        Save
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!isPromptValid ? "Prompt cannot be empty." : "No changes made."}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={disableSaveButton || isUpdating}
                  variant={disableSaveButton ? "outline" : "default"}
                >
                  {isUpdating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              )}
              {!!initialData._id && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await addPromptVersion({
                        promptId: initialData._id,
                        content,
                      });
                      toast.success("New version added!");
                      router.back();
                    } catch (error) {
                      console.error("Add Version Error:", error);
                      toast.error("Failed to add version.");
                    }
                  }}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <Loader className="h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Version
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="h-full min-h-[300px]">
            <PromptEnhancer
              content={content}
              onReplace={handleReplacePrompt}
              onDiscard={() => toast.info("Enhancement discarded")}
              tokenEstimated={tokenEstimated}
            />
          </div>
        </div>

        {/* Share Prompt Modal */}
        <SharePromptModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          promptContent={content}
          versionId={initialData._id}
        />
      </div>
    </TooltipProvider>
  );
}
