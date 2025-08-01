"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, ExternalLink, GitBranch, Loader2, Trash2 } from "lucide-react";
import { useDeletePrompt, useToggleFavoritePrompt } from "@/lib/queries/prompt";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import FavoriteButton from "../common/FavoriteButton";
import { PromptCardProps } from "@/types/prompt";
import type React from "react";
import UpdatePromptTitleModal from "./UpdatePromptModal";
import { formatDistanceToNow } from "date-fns";

export default function PromptCard({
  _id,
  title,
  totalVersions,
  isFavorite,
  createdAt,
  updatedAt,
  activeVersion,
}: PromptCardProps) {
  const displayDate = updatedAt || createdAt;
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeletePrompt(_id);
  const { mutate: favoriteMutate, isPending } = useToggleFavoritePrompt(_id);

  const handleFavorite = () => {
    favoriteMutate();
  };

  const handleDelete = () => {
    deleteMutate();
  };

  const handleViewActiveVersion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVersion?._id) {
      router.push(`${pathname}/${_id}/versions/${activeVersion._id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <Card className="border-border/50 hover:border-border w-full max-w-sm transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold">{title}</h3>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <FavoriteButton
            isFavorite={isFavorite ?? false}
            isPending={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          />

          <UpdatePromptTitleModal promptId={_id} currentTitle={title} />

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Active Version Content Preview */}
        {activeVersion?.content && (
          <div className="bg-muted/30 border-border/30 rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                #v{activeVersion.versionNumber}
              </span>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
            <p className="text-foreground/80 line-clamp-3 text-sm leading-relaxed">
              {truncateContent(activeVersion.content)}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-4 w-4" />
            <span>
              {totalVersions} version{totalVersions !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{formatDate(displayDate)}</span>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent text-xs"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`${pathname}/${_id}/versions`);
          }}
        >
          <GitBranch className="mr-1 h-3 w-3" />
          All Versions
        </Button>

        {activeVersion?._id && (
          <Button
            variant="default"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleViewActiveVersion}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View Active
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
