"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "../ui/loader";
import {
  ArrowRightIcon,
  Plus,
  Redo2Icon,
  Star,
  StarOff,
  TestTube2Icon,
  Undo2Icon,
} from "lucide-react";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useParams, useRouter } from "next/navigation";
import {
  useCreateVersion,
  useUpdateVersion,
  useAddVersion,
  useToggleFavorite,
  useEnhancePrompt,
  useSetActiveVersion,
} from "@/lib/queries/version";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { PromptEnhancer } from "./prompt-enhancer";

type PromptData = {
  _id: string;
  content: string;
  isCurrent: boolean;
  isFavorite: boolean;
  version: number;
  folderId: string;
};

export function PromptForm({
  initialData,
}: Readonly<{ initialData?: PromptData }>) {
  const [content, setContent] = useState(initialData?.content ?? "");
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [showEnhancer, setShowEnhancer] = useState(false);

  const { promptId, versionId } = useParams();

  const isPromptValid = content.trim().length > 0;
  const isUnchanged =
    initialData && content.trim() === initialData.content.trim();
  const disableSaveButton = !isPromptValid || (!!initialData && isUnchanged);

  const router = useRouter();
  const { mutateAsync: createPrompt, isPending: isCreating } =
    useCreateVersion();
  const { mutateAsync: updatePrompt, isPending: isUpdating } =
    useUpdateVersion();
  const { mutateAsync: addPromptVersion, isPending: isAdding } =
    useAddVersion();
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();
  const {
    mutate: enhancePrompt,
    data: enhanced,
    isPending: isEnhancing,
  } = useEnhancePrompt();
  const { mutate: setActiveVersion } = useSetActiveVersion(
    promptId as string,
    versionId as string
  );

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

      await addPromptVersion({
        promptId: initialData._id,
        content,
      });
      toast.success("New version added!");
      router.push(`/prompts/${promptId}/versions`);
    } catch (error) {
      console.error("Add Version Error:", error);
      toast.error("Failed to add new version.");
    }
  };

  const handleEnhance = () => {
    const tokenEstimated = Math.ceil(content.trim().length / 4);
    if (!content.trim()) return;

    enhancePrompt(
      {
        content,
        tokenEstimated,
      },
      {
        onSuccess: () => setShowEnhancer(true),
        onError: (error) =>
          toast.error(
            error instanceof Error ? error.message : "Failed to enhance prompt."
          ),
      }
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite((versionId as string) ?? initialData?._id ?? "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* VERSION DETAILS */}
      {!!initialData && (
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xl font-semibold">
              Version {initialData.version}
            </p>
            {!initialData.isCurrent && (
              <p className="text-sm text-muted-foreground">
                This is not the active version.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {initialData.isCurrent ? (
              <Badge variant="default" className="text-xs">
                Active
              </Badge>
            ) : (
              <Button
                variant="default"
                size="sm"
                type="button"
                onClick={() =>
                  setActiveVersion(
                    {
                      versionId: versionId as string,
                      folderId: promptId as string,
                    },
                    {
                      onSuccess: () => toast.success("Set as active."),
                      onError: () => toast.error("Failed to set active."),
                    }
                  )
                }
                className="cursor-pointer"
              >
                Set as Active
              </Button>
            )}

            <Button
              size="icon"
              variant="ghost"
              type="button"
              className={cn(
                "hover:text-yellow-500 cursor-pointer",
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
                variant="outline"
                disabled={isEnhancing}
                type="button"
                onClick={() =>
                  router.push(`/prompts/${promptId}/versions/${versionId}/test`)
                }
                className="cursor-pointer"
              >
                <TestTube2Icon className="mr-2 h-4 w-4" /> Test Prompt
              </Button>
            )}
          </div>
        </div>
      )}

      {/* PROMPT + ENHANCER */}
      <div
        className={cn(
          "grid gap-6 items-start",
          showEnhancer ? "md:grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* Prompt Textarea Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleEnhance}
              className="group cursor-pointer"
              disabled={!content.trim()}
            >
              <AnimatedShinyText className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                ✨ Enhance with AI
                {isEnhancing ? (
                  <Loader className="ml-2 size-4" />
                ) : (
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                )}
              </AnimatedShinyText>
            </Button>
          </div>
          <Textarea
            id="prompt"
            rows={8}
            placeholder="Write your prompt here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        {/* Enhancer Panel */}
        {showEnhancer && (
          <PromptEnhancer
            content={content}
            enhanced={enhanced ?? ""}
            isLoading={isEnhancing}
            onReplace={(enhanced) => {
              setHistory((prev) => [...prev.slice(-49), content]);
              setRedoStack([]);
              setContent(enhanced);
              setShowEnhancer(false);
            }}
            onDiscard={() => setShowEnhancer(false)}
          />
        )}
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
          <Button
            type="submit"
            disabled={isCreating || isUpdating || isAdding || isEnhancing}
          >
            {(isCreating || isUpdating) && <Loader className="mr-2" />}
            Save
          </Button>
        )}

        {!!initialData?._id && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddVersion}
            disabled={isAdding || isEnhancing}
          >
            {isAdding ? <Loader className="mr-2" /> : <Plus />} Create Version
          </Button>
        )}

        {history.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              const last = history.at(-1);
              if (last !== undefined) {
                setRedoStack((prev) => [...prev.slice(-49), content]);
                setContent(last);
                setHistory((prev) => prev.slice(0, -1));
              }
            }}
          >
            <Undo2Icon className="mr-1 h-4 w-4" /> Undo
          </Button>
        )}

        {redoStack.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              const redoLast = redoStack.at(-1);
              if (redoLast !== undefined) {
                setHistory((prev) => [...prev.slice(-49), content]);
                setContent(redoLast);
                setRedoStack((prev) => prev.slice(0, -1));
              }
            }}
          >
            <Redo2Icon className="mr-1 h-4 w-4" /> Redo
          </Button>
        )}
      </div>
    </form>
  );
}
