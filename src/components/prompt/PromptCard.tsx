"use client";

import {
  Calendar,
  Clock,
  GitBranch,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDeletePrompt, useToggleFavoritePrompt } from "@/lib/queries/prompt";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import FavoriteButton from "../common/FavoriteButton";
import { formatDistanceToNow } from "date-fns";

interface PromptCardProps {
  _id: string;
  title: string;
  totalVersions: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function PromptCard({
  _id,
  title,
  totalVersions,
  isFavorite,
  createdAt,
  updatedAt,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card
      onClick={() => router.push(`${pathname}/${_id}/versions`)}
      className="w-full max-w-sm hover:shadow-lg transition-all duration-200 cursor-pointer group border-border/50 hover:border-border gap-0 py-4"
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors flex-1 min-w-0">
            {title}
          </h3>
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
              {false ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
    </Card>
  );
}
