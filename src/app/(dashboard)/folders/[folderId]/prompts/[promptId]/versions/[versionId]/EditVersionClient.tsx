"use client";

import { AlertTriangle, CheckCircle, Plus, Redo2Icon, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAddVersion,
  useGetVersion,
  useSetActiveVersion,
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
import { cn } from "@/lib/utils";
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

export default function EditVersionClient() {
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

  const { mutateAsync: updatePrompt, isPending: isUpdating } =
    useUpdateVersion();
  const { mutateAsync: addPromptVersion, isPending: isAdding } =
    useAddVersion();
  const { mutate: toggleFavorite, isPending: isToggling } =
    useToggleFavoriteVersion();
  const { mutate: setActiveVersion } = useSetActiveVersion();

  useEffect(() => {
    if (initialData?.content) {
      setContent(initialData.content);
      setTokenEstimated(estimateTokens(initialData.content));
    }
  }, [initialData]);

  const isPromptValid = content.trim().length > 0;
  const isUnchanged =
    initialData && content.trim() === initialData.content.trim();
  const disableSaveButton = !isPromptValid || isUnchanged;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }

    try {
      await updatePrompt({ versionId: versionId as string, content });
      toast.success("Prompt updated successfully!");
      router.back();
    } catch (error) {
      console.error("Update Prompt Error:", error);
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
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load version</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Something went wrong while loading the version. Please try again.
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          <Redo2Icon className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Version Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold">Version {initialData.version}</p>
          {!initialData.isActive && (
            <p className="text-sm text-muted-foreground">
              This is not the active version.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => {
              if (initialData.isActive) return toast.info("Already active");
              setActiveVersion({
                versionId: initialData._id,
                promptId: initialData.promptId,
              });
            }}
            title={initialData.isActive ? "Already Active" : "Set as Active"}
          >
            <CheckCircle
              className={cn(
                "w-5 h-5",
                initialData.isActive ? "text-blue-500" : "text-muted-foreground"
              )}
            />
          </Button>

          <FavoriteButton
            isFavorite={initialData.isFavorite}
            isPending={isToggling}
            onClick={() => toggleFavorite(initialData._id)}
          />

          <Button
            variant="default"
            type="button"
            onClick={() => router.push(`${pathname}/test`)}
            className="ml-2"
          >
            <Zap className="w-4 h-4" /> Test
          </Button>
        </div>
      </div>

      {/* Content + Enhancer */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
        <div className="h-full min-h-[300px]">
          <PromptContentInput
            value={content}
            onChange={(val) => setContent(val)}
            tokenEstimated={tokenEstimated}
            setTokenEstimated={setTokenEstimated}
          />
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {disableSaveButton ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button
                      type="button"
                      variant="outline"
                      disabled
                      className="pointer-events-none"
                    >
                      Save
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {!isPromptValid
                    ? "Prompt cannot be empty."
                    : "No changes made."}
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
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
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
                    <Loader className="w-4 h-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
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
    </div>
  );
}
