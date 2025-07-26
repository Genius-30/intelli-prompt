"use client";

import {
  Bookmark,
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
import {
  useDeleteResponse,
  useSaveModelResponse,
} from "@/lib/queries/response";
import { useEffect, useState } from "react";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type ProviderKey = keyof typeof AI_MODELS;

interface ModelResponseCardProps {
  readonly responseId?: string;
  readonly provider: ProviderKey;
  readonly model: string;
  readonly temperature: number;
  readonly response: string;
  readonly onRemove?: (id: string) => void;
  readonly showRemoveButton?: boolean;
  readonly initiallySaved?: boolean;
}

export function ModelResponseCard({
  responseId,
  provider,
  model,
  temperature,
  response,
  onRemove,
  showRemoveButton = false,
  initiallySaved = false,
}: ModelResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(initiallySaved ?? false);
  const [savedResponseId, setSavedResponseId] = useState<string | null>(
    responseId || null
  );

  const { versionId } = useParams();

  const { mutate: saveModelResponse, isPending: isSaving } =
    useSaveModelResponse();
  const { mutate: deleteResponse, isPending: isDeleting } = useDeleteResponse(
    versionId as string
  );

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
    onRemove?.(model || "");
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
        onSuccess: (data) => {
          setIsSaved(true);
          setSavedResponseId(data?._id ?? null);
          toast.success("Response saved");
        },
        onError: () => {
          toast.error("Failed to save response");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!savedResponseId) {
      toast.error("No saved response to delete");
      return;
    }

    deleteResponse(savedResponseId, {
      onSuccess: () => {
        setIsSaved(false);
        setSavedResponseId(null);
        if (onRemove) {
          onRemove(model || "");
        }
        toast.success("Response deleted");
      },
      onError: () => {
        toast.error("Failed to delete response");
      },
    });
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

              {/* Save/Delete Button */}
              {isSaved ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:text-destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-muted"
                    arrowClassName="bg-muted fill-muted"
                  >
                    Delete response
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Bookmark className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-muted"
                    arrowClassName="bg-muted fill-muted"
                  >
                    Save response
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Remove Button */}
              {showRemoveButton && (
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
              )}

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
