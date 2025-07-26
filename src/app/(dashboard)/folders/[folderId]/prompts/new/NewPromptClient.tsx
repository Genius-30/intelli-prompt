"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { PromptContentInput } from "@/components/version/PromptContentInput";
import { PromptEnhancer } from "@/components/prompt/PromptEnhancer";
import { estimateTokens } from "@/utils/tokeEstimate";
import { toast } from "sonner";
import { useCreatePrompt } from "@/lib/queries/prompt";
import { useState } from "react";

export default function NewPromptClient() {
  const { folderId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tokenEstimated, setTokenEstimated] = useState(100);

  const createPromptMutation = useCreatePrompt();

  const router = useRouter();

  const handleReplacePrompt = (enhanced: string) => {
    setContent(enhanced);
    setTokenEstimated(estimateTokens(enhanced));
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

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Prompt Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title for your prompt..."
          className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
        {/* Original Prompt Section */}
        <div className="space-y-6">
          <PromptContentInput
            value={content}
            onChange={(val) => setContent(val)}
            tokenEstimated={tokenEstimated}
            setTokenEstimated={setTokenEstimated}
          />
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
    </div>
  );
}
