"use client";

import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps extends ComponentProps<"button"> {
  isFavorite: boolean;
  isPending?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FavoriteButton({
  isFavorite,
  isPending = false,
  onClick,
  className,
  ...props
}: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={cn("p-1 rounded hover:bg-muted/50 transition", className)}
      disabled={isPending}
      {...props}
    >
      {isFavorite ? (
        <Star className="h-5 w-5 text-yellow-500 fill-current" />
      ) : (
        <Star className="h-5 w-5 text-gray-400" />
      )}
    </Button>
  );
}
