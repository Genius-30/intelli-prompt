"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  isPending: boolean;
  onClick: () => void;
}

export default function FavoriteButton({
  isFavorite,
  isPending,
  onClick,
}: FavoriteButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={onClick}
          disabled={isPending}
          className={`${
            isFavorite
              ? "text-amber-500 hover:text-amber-600"
              : "text-muted-foreground hover:text-amber-500"
          }`}
        >
          <Star className={`w-3 h-3 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-muted" arrowClassName="bg-muted fill-muted">
        <p>{isFavorite ? "Remove favorite" : "Mark as favorite"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
