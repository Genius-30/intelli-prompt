"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock, ExternalLink, GitBranch, Loader2, Trash2 } from "lucide-react";
import { useDeletePrompt, useToggleFavoritePrompt } from "@/lib/queries/prompt";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import FavoriteButton from "../common/FavoriteButton";
import type React from "react";
import { formatDistanceToNow } from "date-fns";

interface ActiveVersion {
  _id: string;
  content: string;
  versionNumber: number;
  isActive: boolean;
  createdAt?: string;
}

interface PromptCardProps {
  _id: string;
  title: string;
  totalVersions: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
  activeVersion?: ActiveVersion;
}

export default function PromptCard({
  _id,
  title,
  totalVersions,
  isFavorite,
  createdAt,
  updatedAt,
  activeVersion,
}: PromptCardProps) {
  const displayDate = updatedAt ? updatedAt : createdAt;
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
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <FavoriteButton
            isFavorite={isFavorite ?? false}
            isPending={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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

      <CardContent className="pt-0 space-y-4">
        {/* Active Version Content Preview */}
        {activeVersion?.content && (
          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                #v2{activeVersion.versionNumber}
              </span>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
              {truncateContent(activeVersion.content)}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          className="flex-1 text-xs bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`${pathname}/${_id}/versions`);
          }}
        >
          <GitBranch className="h-3 w-3 mr-1" />
          All Versions
        </Button>

        {activeVersion?._id && (
          <Button
            variant="default"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleViewActiveVersion}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Active
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
