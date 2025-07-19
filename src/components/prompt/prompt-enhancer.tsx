"use client";

import { AlertCircle, CheckCircle2, Copy, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useEnhancePrompt } from "@/lib/queries/version";

type PromptEnhancerProps = {
  readonly content: string;
  readonly onReplace: (enhanced: string) => void;
  readonly onDiscard: () => void;
  readonly tokenEstimated?: number;
};

export function PromptEnhancer({
  content,
  onReplace,
  onDiscard,
  tokenEstimated = 100,
}: PromptEnhancerProps) {
  const [enhancedContent, setEnhancedContent] = useState<string>("");
  const [hasEnhanced, setHasEnhanced] = useState(false);
  const enhanceMutation = useEnhancePrompt();

  // Auto-enhance when content changes
  useEffect(() => {
    if (content.trim() && !hasEnhanced) {
      handleEnhance();
      setHasEnhanced(true);
    }
  }, [content, hasEnhanced]);

  const handleEnhance = () => {
    if (!content.trim()) return;

    enhanceMutation.mutate(
      { content, tokenEstimated },
      {
        onSuccess: (enhanced) => {
          setEnhancedContent(enhanced);
        },
        onError: (error) => {
          console.error("Enhancement failed:", error);
        },
      }
    );
  };

  const handleRetry = () => {
    setHasEnhanced(true);
    handleEnhance();
  };

  const handleReplace = () => {
    if (enhancedContent) {
      onReplace(enhancedContent);
    }
  };

  let contentDisplay;

  if (enhanceMutation.isPending) {
    contentDisplay = (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6" />
        <span className="ml-3 text-sm text-muted-foreground">
          Enhancing your prompt with AI...
        </span>
      </div>
    );
  } else if (enhanceMutation.isError) {
    contentDisplay = (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive opacity-50" />
        <div className="text-center">
          <p className="text-sm text-destructive font-medium">
            Enhancement failed
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {enhanceMutation.error?.message || "Something went wrong"}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRetry}
          className="mt-2 bg-transparent"
        >
          Try Again
        </Button>
      </div>
    );
  } else if (enhancedContent) {
    contentDisplay = (
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Enhanced successfully
          </span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap bg-green-50/50 dark:bg-green-950/20 p-3 rounded-md border border-green-200/50 dark:border-green-800/50">
          {enhancedContent}
        </p>
      </div>
    );
  } else {
    contentDisplay = (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <span className="text-muted-foreground text-sm">
            Waiting for content to enhance
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-muted/50 to-muted border border-border/50 rounded-xl p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Enhanced Version
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          {tokenEstimated && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              ~{tokenEstimated} tokens
            </span>
          )}
        </div>
      </div>

      <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-lg p-4 min-h-[120px] shadow-inner">
        {contentDisplay}
      </div>

      {enhancedContent &&
        !enhanceMutation.isPending &&
        !enhanceMutation.isError && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/30">
            <Button
              size="sm"
              onClick={handleReplace}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              Replace Original
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-2 bg-transparent"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Re-enhance
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onDiscard();
                setEnhancedContent("");
                setHasEnhanced(false);
              }}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
              Discard
            </Button>
          </div>
        )}
    </div>
  );
}
