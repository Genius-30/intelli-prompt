"use client";

import { Calendar, Clock, GitBranch, Loader2, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import FavoriteButton from "../common/FavoriteButton";
import { formatDistanceToNow } from "date-fns";
import { useToggleFavoritePrompt } from "@/lib/queries/prompt";

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

  const { mutate, isPending } = useToggleFavoritePrompt(_id);

  const handleFavorite = () => {
    mutate();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card
      onClick={() => router.push(`${pathname}/${_id}`)}
      className="w-full max-w-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group gap-2"
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <FavoriteButton
            isFavorite={isFavorite ?? false}
            isPending={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4" />
            <span>
              {totalVersions} version{totalVersions !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(displayDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
