"use client";

import {
  AlertTriangle,
  CheckCircle,
  Plus,
  Redo2Icon,
  Star,
  StarOff,
  Zap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreateVersion,
  useGetVersion,
  useSetActiveVersion,
  useToggleFavoriteVersion,
  useUpdateVersion,
} from "@/lib/queries/version";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { PromptContentInput } from "@/components/version/PromptContentInput";
import { PromptEnhancer } from "@/components/prompt/PromptEnhancer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { estimateTokens } from "@/utils/tokeEstimate";
import { toast } from "sonner";
import { useState } from "react";

export default function EditPromptClient() {
  const { promptId, versionId } = useParams();
  const router = useRouter();
  const {
    data: initialData,
    isPending,
    isError,
  } = useGetVersion(versionId as string);

  const [content, setContent] = useState(initialData?.content ?? "");
  const [tokenEstimated, setTokenEstimated] = useState<number>(
    Math.ceil((initialData?.content.length ?? 0) / 4)
  );

  const isPromptValid = content.trim().length > 0;
  const isUnchanged =
    initialData && content.trim() === initialData.content.trim();
  const disableSaveButton = !isPromptValid || (!!initialData && isUnchanged);

  const { mutateAsync: createPrompt, isPending: isCreating } =
    useCreateVersion();
  const { mutateAsync: updatePrompt, isPending: isUpdating } =
    useUpdateVersion();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavoriteVersion();
  const { mutate: setActiveVersion } = useSetActiveVersion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }

    try {
      if (initialData?._id) {
        await updatePrompt({
          versionId: initialData._id,
          content,
        });
        toast.success("Prompt updated successfully!");
      } else {
        if (!promptId) {
          toast.error("Missing promptId for new prompt.");
          return;
        }

        await createPrompt({
          content,
          folderId: promptId as string,
        });
        toast.success("Prompt created successfully!");
        router.push(`/prompts/${promptId}/versions`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleAddVersion = async () => {
    try {
      if (!initialData?._id) {
        toast.error("Prompt ID is missing.");
        return;
      }
    } catch (error) {
      console.error("Add Version Error:", error);
      toast.error("Failed to add new version.");
    }
  };

  const handleReplacePrompt = (enhanced: string) => {
    setContent(enhanced);
    setTokenEstimated(estimateTokens(enhanced));
    toast.success("Prompt replaced with enhanced version");
  };

  const handleDiscardEnhancement = () => {
    toast.info("Enhancement discarded");
  };

  const handleSetActive = () => {
    if (initialData?.isCurrent) {
      toast.info("This prompt version is already active");
      return;
    }

    setActiveVersion(
      {
        versionId: initialData?._id as string,
        promptId: initialData?.promptId as string,
      },
      {
        onSuccess: () => toast.success("Set as active"),
        onError: () => toast.error("Failed to set active"),
      }
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite((versionId as string) ?? initialData?._id ?? "");
  };

  if (isPending) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-3 w-full md:justify-end">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError || !initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load prompt</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Something went wrong while loading the prompt. Please try refreshing
          the page.
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          <Redo2Icon className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* VERSION DETAILS */}
      {!!initialData && (
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xl font-semibold">
              Version {initialData.versionNumber}
            </p>
            {!initialData.isCurrent && (
              <p className="text-sm text-muted-foreground">
                This is not the active version.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleSetActive}
              title={
                initialData?.isCurrent ? "Active Version" : "Set as Active"
              }
            >
              <CheckCircle
                className={`w-5 h-5 ${
                  initialData?.isCurrent
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              type="button"
              className={cn(
                "hover:text-yellow-500 cursor-pointer mr-2",
                initialData.isFavorite && "text-yellow-500"
              )}
              onClick={handleToggleFavorite}
              disabled={isPending}
            >
              {initialData.isFavorite ? (
                <Star className="w-4 h-4 fill-yellow-400" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </Button>

            {/* Show "Test Prompt" only if editing */}
            {versionId && (
              <Button
                variant="default"
                type="button"
                onClick={() =>
                  router.push(`/prompts/${promptId}/versions/${versionId}/test`)
                }
                className="cursor-pointer"
              >
                <Zap className="w-4 h-4" /> Test Prompt
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
        {/* Prompt Content Input */}
        <PromptContentInput
          value={content}
          onChange={(val) => setContent(val)}
          tokenEstimated={tokenEstimated}
          setTokenEstimated={setTokenEstimated}
        />

        {/* Enhance Prompt Section */}
        <div className="h-full">
          <PromptEnhancer
            content={content}
            onReplace={handleReplacePrompt}
            onDiscard={handleDiscardEnhancement}
            tokenEstimated={tokenEstimated}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {disableSaveButton ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline">
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {!isPromptValid ? "Prompt cannot be empty." : "No changes made."}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button type="submit" disabled={isCreating || isUpdating}>
            {(isCreating || isUpdating) && <Loader className="mr-2" />}
            Save
          </Button>
        )}

        {!!initialData?._id && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddVersion}
            disabled={isCreating || isUpdating}
          >
            {isCreating ? <Loader className="mr-2" /> : <Plus />} Create Version
          </Button>
        )}
      </div>
    </form>
  );
}
