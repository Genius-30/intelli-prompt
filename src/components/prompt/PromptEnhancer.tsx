"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Copy,
  Sparkles,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
  const [isCancelled, setIsCancelled] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const enhanceMutation = useEnhancePrompt();

  const handleEnhance = () => {
    if (!content.trim()) return;
    setIsCancelled(false);
    setEnhancedContent("");

    // Abort previous if any
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    enhanceMutation.mutate(
      { content, tokenEstimated, signal: controller.signal },
      {
        onSuccess: (enhanced) => {
          if (controller.signal.aborted) return;

          if (
            typeof enhanced === "string" &&
            enhanced.toLowerCase().includes("error calling openrouter")
          ) {
            // Treat this as error
            toast.error("Enhancement failed!");
            enhanceMutation.reset();
            setEnhancedContent("");
          } else {
            setEnhancedContent(enhanced);
          }
        },
        onError: (error) => {
          if (controller.signal.aborted) {
            console.warn("Enhancement cancelled by user");
            setIsCancelled(true);
          } else {
            toast.error(
              error?.message || "AI enhancement failed. Please try again."
            );
            console.error("Enhancement failed:", error);
          }
        },
      }
    );
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setIsCancelled(true);
    enhanceMutation.reset();
  };

  const handleRetry = () => {
    setEnhancedContent("");
    setIsCancelled(false);
    handleEnhance();
  };

  const handleReplace = () => {
    if (enhancedContent) {
      onReplace(enhancedContent);
      setEnhancedContent("");
      setIsCancelled(false);
    }
  };

  const handleDiscard = () => {
    onDiscard();
    setEnhancedContent("");
    setIsCancelled(false);
    abortControllerRef.current?.abort();
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
            setEnhancedContent("");
            abortControllerRef.current?.abort();
            enhanceMutation.reset();
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
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium text-center text-muted-foreground">
            AI Enhancement Ready
          </h3>
          <p className="text-sm text-center text-muted-foreground">
            Enter your prompt content and click the button below to enhance it
            with AI.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnhance}
          disabled={!content.trim() || enhanceMutation.isPending}
          className="cursor-pointer disabled:bg-muted rounded-full"
        >
          <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
              className={cn(
                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <Sparkles className="w-4 h-4 text-[#ffaa40]" />
            <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Enhance with AI
            </AnimatedGradientText>
            <ChevronRight
              className="ml-1 size-4 stroke-neutral-500 transition-transform
            duration-300 ease-in-out group-hover:translate-x-0.5"
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-muted/30 to-muted/40 border border-border/50 rounded-lg p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Enhanced Version
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          {!!tokenEstimated && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              ~{tokenEstimated} tokens
            </span>
          )}
        </div>
      </div>

      <div className="min-h-[200px] h-full flex items-center justify-around bg-muted/50 backdrop-blur-sm border border-border/30 rounded-lg p-4">
        {contentDisplay}
      </div>

      {enhancedContent &&
        !enhanceMutation.isPending &&
        !enhanceMutation.isError && (
          <div className="flex items-center flex-wrap gap-3 mt-4 border-t border-border/30">
            <Button
              size="sm"
              onClick={handleReplace}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              Replace Original
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              className="flex items-center gap-2 bg-transparent cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Re-enhance
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDiscard}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Discard
            </Button>
          </div>
        )}
    </div>
  );
}
