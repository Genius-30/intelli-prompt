"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Star, StarOff, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { AI_MODELS } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import {
  useSetFavoriteResponse,
  useDeleteResponse,
} from "@/lib/queries/response";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const [isOpen, setIsOpen] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const { versionId } = useParams();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useSetFavoriteResponse(versionId as string);
  const { mutate: deleteResponse, isPending: isDeletingResponse } =
    useDeleteResponse(versionId as string);
  const color = AI_MODELS[provider]?.color || "#ccc";

  const MAX_CHARS = 500;
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

  return (
    <Card className="overflow-hidden border" style={{ borderColor: color }}>
      <CardHeader className="flex justify-between items-center bg-muted px-4 py-2">
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-sm capitalize flex items-center gap-2">
            <Badge style={{ backgroundColor: color }}>
              {provider.toUpperCase()}
            </Badge>
            <span className="text-foreground">{model}</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Temperature: {temperature}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "hover:text-yellow-500 cursor-pointer",
              favorite && "text-yellow-500"
            )}
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            {favorite ? (
              <Star className="w-4 h-4 fill-yellow-400" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={handleDelete}
            disabled={isDeletingResponse}
          >
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="prose max-w-none text-sm dark:prose-invert">
        <ReactMarkdown>
          {isOpen ? response : isTruncated ? `${previewText}...` : previewText}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
