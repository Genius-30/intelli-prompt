"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ThermometerSun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { getModelProviderDetails } from "@/utils/ai-model-utils";
import { useModelResponse } from "@/lib/queries/response";
import { useState } from "react";

type ProviderKey = keyof typeof AI_MODELS;

export function ModelResponseSection({ responseId }: { readonly responseId?: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: modelResponse, isLoading } = useModelResponse(responseId as string, {
    enabled: !!responseId,
  });

  const response = modelResponse?.response;
  const model = modelResponse?.model;
  const temperature = modelResponse?.temperature;

  const { Icon, providerName, color } = getModelProviderDetails(modelResponse?.model || "") || {
    Icon: null,
    providerName: "Unknown",
    color: "#000",
  };

  const MAX_CHARS = 400;
  const isTruncated = response?.length > MAX_CHARS;
  const previewText = isTruncated ? response.slice(0, MAX_CHARS) : response;

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: "#e5e7eb" }}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  // Handle no responseId or empty response
  if (!responseId || !response) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50/50 p-6 text-red-600 dark:border-red-800/50 dark:bg-red-950/20 dark:text-red-400">
        <p className="flex items-center">
          <span className="mr-2">⚠️</span> Model response not available or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <Card
      className="group overflow-hidden border-l-4 transition-all duration-200 hover:shadow-lg"
      style={{ borderLeftColor: color }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
            {Icon && <Icon className="h-4 w-4" style={{ color }} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs font-medium"
                style={{ backgroundColor: `${color}20`, color: color }}
              >
                {providerName}
              </Badge>
              <span className="text-sm font-medium">{model}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <ThermometerSun className="text-muted-foreground h-3 w-3" />
              <span className="text-muted-foreground text-xs">Temperature: {temperature}</span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto h-8 w-8"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-muted" arrowClassName="bg-muted fill-muted">
                {isExpanded ? "Collapse" : "Expand"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {isExpanded ? response : isTruncated ? `${previewText}...` : previewText}
          </ReactMarkdown>
        </div>

        {isTruncated && !isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-8 text-xs"
            onClick={() => setIsExpanded(true)}
          >
            Show more
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
