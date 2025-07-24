"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Star,
  StarOff,
  ThermometerSun,
  Trash2,
} from "lucide-react";
import {
  useDeleteResponse,
  useSetFavoriteResponse,
} from "@/lib/queries/response";

import { AI_MODELS } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";

type ProviderKey = keyof typeof AI_MODELS;

interface ModelResponseCardProps {
  readonly provider: ProviderKey;
  readonly model: string;
  readonly temperature: number;
  readonly response: string;
  readonly modelId: string;
  readonly isFavorite?: boolean;
  readonly onDeleteLocally?: (id: string) => void;
}

export function ModelResponseCard({
  provider,
  model,
  temperature,
  response,
  modelId,
  isFavorite = false,
  onDeleteLocally,
}: ModelResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const { versionId } = useParams();

  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useSetFavoriteResponse(versionId as string);
  const { mutate: deleteResponse, isPending: isDeletingResponse } =
    useDeleteResponse(versionId as string);

  const providerData = AI_MODELS[provider];
  const IconComponent = providerData?.icon;
  const color = providerData?.color || "#6b7280";

  const MAX_CHARS = 400;
  const isTruncated = response.length > MAX_CHARS;
  const previewText = isTruncated ? response.slice(0, MAX_CHARS) : response;

  const handleToggleFavorite = () => {
    toggleFavorite(modelId, {
      onSuccess: () => {
        const newState = !favorite;
        setFavorite(newState);
        toast.success(
          newState ? "Marked as favorite" : "Removed from favorites"
        );
      },
      onError: () => toast.error("Failed to toggle favorite"),
    });
  };

  const handleDelete = () => {
    deleteResponse(modelId, {
      onSuccess: () => {
        toast.success("Response deleted!");
        onDeleteLocally?.(modelId);
      },
      onError: () => toast.error("Failed to delete response"),
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      toast.success("Response copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy response");
    }
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
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 hover:text-yellow-500",
                favorite && "text-yellow-500"
              )}
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
            >
              {favorite ? (
                <Star className="w-3 h-3 fill-current" />
              ) : (
                <StarOff className="w-3 h-3" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeletingResponse}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
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
