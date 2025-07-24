"use client";

import { Redo2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface PromptContentInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly tokenEstimated: number;
  readonly setTokenEstimated: (value: number) => void;
}

export function PromptContentInput({
  value,
  onChange,
  tokenEstimated,
  setTokenEstimated,
}: PromptContentInputProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const MAX_HISTORY = 20;

  const estimateTokens = (text: string) => Math.ceil(text.length / 4);

  const handleChange = (val: string) => {
    setHistory((prev) => {
      const newHistory = [...prev, value];
      return newHistory.length > MAX_HISTORY ? newHistory.slice(1) : newHistory;
    });
    onChange(val);
    setTokenEstimated(estimateTokens(val));
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setFuture((prev) => [value, ...prev]);
    const prevContent = history[history.length - 1];
    onChange(prevContent);
    setTokenEstimated(estimateTokens(prevContent));
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    setHistory((prev) => [...prev, value]);
    const nextContent = future[0];
    onChange(nextContent);
    setTokenEstimated(estimateTokens(nextContent));
    setFuture((prev) => prev.slice(1));
  };

  return (
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="content" className="text-sm font-medium">
          Prompt Content
        </Label>
        <span className="text-xs text-muted-foreground">
          ~{tokenEstimated} tokens
        </span>
      </div>

      <div className="relative flex-1 min-h-[280px]">
        <Textarea
          id="content"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your prompt content here... Be specific about what you want to achieve."
          className="h-[calc(100%-60px)] min-h-[280px] w-full resize-none border-border/50 focus:border-primary/50 bg-background/50"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {value.length} characters
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
  );
}
