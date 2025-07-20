"use client";

import { AlertCircle, CheckCircle2, Copy, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import { useEnhancePrompt } from "@/lib/queries/version";

type PromptEnhancerProps = {
  readonly content: string;
  readonly onReplace: (enhanced: string) => void;
  readonly onDiscard: () => void;
  readonly tokenEstimated?: number;
  readonly enhanceNow?: boolean;
};

export function PromptEnhancer({
  content,
  onReplace,
  onDiscard,
  tokenEstimated = 100,
  enhanceNow = false,
}: PromptEnhancerProps) {
  const [enhancedContent, setEnhancedContent] = useState<string>("");
  const [hasEnhanced, setHasEnhanced] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const enhanceMutation = useEnhancePrompt();

  useEffect(() => {
    if (enhanceNow && content.trim()) {
      handleEnhance();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [enhanceNow]);

  const handleEnhance = () => {
    if (!content.trim()) return;
    setIsCancelled(false);

    // Abort previous if any
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    enhanceMutation.mutate(
      { content, tokenEstimated, signal: controller.signal },
      {
        onSuccess: (enhanced) => {
          if (!controller.signal.aborted) {
            setEnhancedContent(enhanced);
          }
        },
        onError: (error) => {
          if (controller.signal.aborted) {
            console.warn("Enhancement cancelled by user");
            setIsCancelled(true);
          } else {
            console.error("Enhancement failed:", error);
          }
        },
      }
    );
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setIsCancelled(true);
    setHasEnhanced(false);
    enhanceMutation.reset();
  };

  const handleRetry = () => {
    setHasEnhanced(true);
    setEnhancedContent("");
    handleEnhance();
  };

  const handleReplace = () => {
    if (enhancedContent) {
      onReplace(enhancedContent);
      setHasEnhanced(false);
    }
  };

  let contentDisplay;

  if (enhanceMutation.isPending && !isCancelled) {
    contentDisplay = (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="flex items-center justify-center">
          <Loader className="w-6 h-6" />
          <span className="ml-3 text-sm text-muted-foreground">
            Enhancing your prompt with AI...
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="bg-transparent"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    );
  } else if (isCancelled) {
    contentDisplay = (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <span className="text-sm text-muted-foreground">
          Enhancement cancelled.
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsCancelled(false);
            setHasEnhanced(false);
            handleEnhance();
          }}
          className="bg-transparent"
        >
          Try Again
        </Button>
      </div>
    );
  } else if (enhanceMutation.isError) {
    // Custom error handling for 402 and 403
    let errorTitle = "Enhancement failed";
    let errorMessage = enhanceMutation.error?.message || "Something went wrong";
    let showRetry = true;
    let actionButton = null;

    // Try to extract status code if available
    let status: number | undefined = undefined;
    const error = enhanceMutation.error as any;
    if (error) {
      status = error.status ?? error.response?.status;
    }

    if (status === 402) {
      errorTitle = "Not enough tokens";
      errorMessage =
        "You have run out of tokens. Please upgrade your plan or wait for your quota to reset.";
      showRetry = false;
      actionButton = (
        <Button
          size="sm"
          variant="outline"
          className="mt-2 bg-transparent"
          asChild
        >
          <Link href="/pricing">Upgrade Plan</Link>
        </Button>
      );
    } else if (status === 403) {
      errorTitle = "Subscription Ended";
      errorMessage =
        "Your subscription has ended. Please renew to continue using AI enhancements.";
      showRetry = false;
      actionButton = (
        <Button
          size="sm"
          variant="outline"
          className="mt-2 bg-transparent"
          asChild
        >
          <Link href="/pricing">Renew Subscription</Link>
        </Button>
      );
    }

    contentDisplay = (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive opacity-50" />
        <div className="text-center">
          <p className="text-sm text-destructive font-medium">{errorTitle}</p>
          <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
        </div>
        {showRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetry}
            className="mt-2 bg-transparent"
          >
            Try Again
          </Button>
        )}
        {actionButton}
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

      <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-lg p-4 min-h-[200px] shadow-inner">
        {contentDisplay}
      </div>

      {enhancedContent &&
        !enhanceMutation.isPending &&
        !enhanceMutation.isError && (
          <div className="flex items-center flex-wrap gap-3 mt-4 pt-4 border-t border-border/30">
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
