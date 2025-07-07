"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

type PromptEnhancerProps = {
  readonly content: string;
  readonly enhanced: string;
  readonly isLoading: boolean;
  readonly onReplace: (enhanced: string) => void;
  readonly onDiscard: () => void;
};

export function PromptEnhancer({
  content,
  enhanced,
  isLoading,
  onReplace,
  onDiscard,
}: PromptEnhancerProps) {
  let enhancedContent;
  if (isLoading) {
    enhancedContent = <Loader className="w-6 h-6" />;
  } else if (enhanced) {
    enhancedContent = <span>{enhanced}</span>;
  } else {
    enhancedContent = (
      <span className="text-muted-foreground text-xs">
        No enhancement found.
      </span>
    );
  }

  return (
    <div className="h-full flex-1 bg-muted p-4 rounded-md space-y-2">
      <p className="text-sm text-muted-foreground font-medium">
        ✨ Enhanced Prompt
      </p>

      <div className="bg-input dark:bg-input/30 border py-2 px-3 rounded-md text-sm min-h-[50px] flex items-center">
        {enhancedContent}
      </div>

      <div className="flex gap-2 pt-2">
        <Button size="sm" onClick={() => onReplace(enhanced)}>
          Replace
        </Button>
        <Button size="sm" variant="ghost" onClick={onDiscard}>
          Discard
        </Button>
      </div>
    </div>
  );
}
