"use client";

import {
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  CircleX,
  Copy,
  CopyCheck,
  ThermometerSun,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

import { AI_MODELS } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useSaveModelResponse } from "@/lib/queries/response";

type ProviderKey = keyof typeof AI_MODELS;

interface ModelResponseCardProps {
  readonly provider: ProviderKey;
  readonly model: string;
  readonly temperature: number;
  readonly response: string;
  readonly modelId: string;
  readonly onRemove?: (id: string) => void;
}

export function ModelResponseCard({
  provider,
  model,
  temperature,
  response,
  modelId,
  onRemove,
}: ModelResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { versionId } = useParams();
  const { mutate: saveModelResponse, isPending: isSaving } =
    useSaveModelResponse();

  const providerData = AI_MODELS[provider];
  const IconComponent = providerData?.icon;
  const color = providerData?.color || "#6b7280";

  const MAX_CHARS = 400;
  const isTruncated = response.length > MAX_CHARS;
  const previewText = isTruncated ? response.slice(0, MAX_CHARS) : response;

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleRemove = () => {
    onRemove?.(modelId);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
    } catch (error) {
      toast.error("Failed to copy response");
    }
  };

  const handleSave = () => {
    if (!versionId || typeof versionId !== "string") {
      toast.error("Missing version ID");
      return;
    }

    saveModelResponse(
      {
        versionId,
        model,
        temperature,
        response,
      },
      {
        onSuccess: () => {
          setIsSaved(true);
        },
        onError: () => {
          toast.error("Failed to save response");
        },
      }
    );
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4"
      style={{ borderLeftColor: color }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              {IconComponent && (
                <IconComponent className="w-4 h-4" style={{ color: color }} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium"
                  style={{ backgroundColor: `${color}20`, color: color }}
                >
                  {providerData?.name || provider.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium">{model}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <ThermometerSun className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Temperature: {temperature}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              {/* Copy Button */}
              <Tooltip open={isCopied}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <CopyCheck className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-muted"
                  arrowClassName="bg-muted fill-muted"
                >
                  {isCopied && "Copied!"}
                </TooltipContent>
              </Tooltip>

              {/* Save Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-3 h-3" />
                    ) : (
                      <Bookmark className="w-3 h-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-muted"
                  arrowClassName="bg-muted fill-muted"
                >
                  {isSaved ? "Saved!" : "Save response"}
                </TooltipContent>
              </Tooltip>

              {/* Remove Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={handleRemove}
                  >
                    <CircleX className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-muted"
                  arrowClassName="bg-muted fill-muted"
                >
                  Remove response
                </TooltipContent>
              </Tooltip>

              {/* Expand/Collapse Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-muted"
                  arrowClassName="bg-muted fill-muted"
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>
            {isExpanded
              ? response
              : isTruncated
              ? `${previewText}...`
              : previewText}
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
