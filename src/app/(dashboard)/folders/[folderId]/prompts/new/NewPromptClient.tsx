"use client";

import { Edit3, Redo2, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { PromptEnhancer } from "@/components/prompt/PromptEnhancer";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreatePrompt } from "@/lib/queries/prompt";
import { useState } from "react";

export default function NewPromptClient() {
  const { folderId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const MAX_HISTORY = 20;
  const [tokenEstimated, setTokenEstimated] = useState(100);

  const createPromptMutation = useCreatePrompt();

  const router = useRouter();

  // Estimate tokens (rough calculation: ~4 characters per token)
  const estimateTokens = (text: string) => {
    return Math.ceil(text.length / 4);
  };

  const handleContentChange = (value: string) => {
    setHistory((prev) => {
      const newHistory = [...prev, content];
      return newHistory.length > MAX_HISTORY ? newHistory.slice(1) : newHistory;
    });
    setContent(value);
    setTokenEstimated(estimateTokens(value));
    setFuture([]); // clear redo stack on new input
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setFuture((prev) => [content, ...prev]);
    const prevContent = history[history.length - 1];
    setContent(prevContent);
    setTokenEstimated(estimateTokens(prevContent));
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    setHistory((prev) => [...prev, content]);
    const nextContent = future[0];
    setContent(nextContent);
    setTokenEstimated(estimateTokens(nextContent));
    setFuture((prev) => prev.slice(1));
  };

  const handleReplacePrompt = (enhanced: string) => {
    setContent(enhanced);
    setTokenEstimated(estimateTokens(enhanced));
    toast.success("Prompt replaced with enhanced version");
  };

  const handleDiscardEnhancement = () => {
    toast.info("Enhancement discarded");
  };

  const handleSavePrompt = () => {
    if (!title.trim()) {
      toast.error("Please enter a prompt title");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter prompt content");
      return;
    }

    createPromptMutation.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        folderId: String(folderId ?? ""),
      },
      {
        onSuccess: () => {
          // Reset form or redirect as needed
          setTitle("");
          setContent("");
          setHistory([]);
          setFuture([]);
          router.push(`/folders/${folderId}/prompts/`);
        },
        onError: (error) => {
          console.error("Create prompt failed:", error);
        },
      }
    );
  };

  const isFormValid = title.trim() && content.trim();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-start">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Create New Prompt
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your first prompt version and enhance it with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
        {/* Original Prompt Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Prompt Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your prompt..."
                className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-sm font-medium">
                  Prompt Content *
                </Label>
                <span className="text-xs text-muted-foreground">
                  ~{tokenEstimated} tokens
                </span>
              </div>

              <div className="relative">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Enter your prompt content here... Be specific about what you want to achieve."
                  className="min-h-[250px] resize-none border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm pr-28"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {content.length} characters
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="p-1 h-6 w-6"
                    aria-label="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleRedo}
                    disabled={future.length === 0}
                    className="p-1 h-6 w-6"
                    aria-label="Redo"
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Prompt Section */}
        <div className="h-full">
          <PromptEnhancer
            content={content}
            onReplace={handleReplacePrompt}
            onDiscard={handleDiscardEnhancement}
            tokenEstimated={tokenEstimated}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSavePrompt}
          disabled={!isFormValid || createPromptMutation.isPending}
          className="flex items-center gap-2"
        >
          {createPromptMutation.isPending ? (
            <>
              <Loader className="w-4 h-4" />
              Creating...
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Create Prompt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
