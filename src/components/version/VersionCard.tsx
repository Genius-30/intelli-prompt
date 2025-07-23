"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckIcon,
  Clock,
  MoreVertical,
  Share,
  Sparkles,
  SquarePenIcon,
  Star,
  TrashIcon,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import FavoriteButton from "../common/FavoriteButton";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { forwardRef } from "react";
import { usePathname } from "next/navigation";
import { useToggleFavoriteVersion } from "@/lib/queries/version";

interface Version {
  _id: string;
  ownerId: string;
  promptId: string;
  content: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VersionCardProps {
  version: Version;
  versionNumber: number;
  promptId: string;
  onSetActive: (versionId: string) => void;
  onDelete: (versionId: string) => void;
  isActivating: boolean;
  isDeleting: boolean;
}

export const VersionCard = forwardRef<HTMLDivElement, VersionCardProps>(
  (
    {
      version,
      versionNumber,
      promptId,
      onSetActive,
      onDelete,
      isActivating,
      isDeleting,
    },
    ref
  ) => {
    const isActive = version.isActive;
    const pathname = usePathname();

    const { mutate: toggleFavorite, isPending } = useToggleFavoriteVersion();

    return (
      <Card
        ref={ref}
        className={`transition-all group hover:shadow-md hover:border-muted duration-200 py-4 ${
          isActive
            ? "ring-2 ring-primary/30 bg-primary/5 border-primary/40"
            : ""
        }`}
      >
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 w-full">
            {/* Version Info */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between md:justify-start gap-3 flex-wrap">
                <div
                  className={`min-w-6 h-6 p-1 rounded-lg flex items-center justify-center text-sm font-semibold ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  v{versionNumber}
                </div>
                <FavoriteButton
                  isFavorite={version.isFavorite}
                  isPending={isPending}
                  onClick={() => toggleFavorite(version._id)}
                />
              </div>

              <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed break-words">
                {version.content}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  Updated{" "}
                  {formatDistanceToNow(new Date(version.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end md:items-center justify-between md:justify-normal gap-2 flex-shrink-0 w-full md:w-auto">
              <div className="flex flex-wrap gap-2 md:w-auto">
                {/* Edit Button */}
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-xs px-2 md:w-auto"
                >
                  <Link href={`${pathname}/${version._id}`}>
                    <SquarePenIcon className="w-3 h-3 mr-1" />
                    Edit
                  </Link>
                </Button>

                {/* Test Button */}
                <Button
                  asChild
                  size="sm"
                  variant="default"
                  className="text-xs md:w-auto"
                >
                  <Link href={`${pathname}/${version._id}/test`}>
                    <Zap className="w-3 h-3 mr-1" />
                    Test
                  </Link>
                </Button>

                {/* Share to Community Button */}
                <Button
                  onClick={() => {
                    // You can open modal or navigate to share route
                    console.log("Share to Community clicked");
                  }}
                  size="sm"
                  variant="default"
                  className="text-xs md:w-auto"
                >
                  <Share className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>

              {/* Dropdown for more options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 self-end"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!isActive && (
                    <DropdownMenuItem
                      onClick={() => onSetActive(version._id)}
                      disabled={isActivating}
                    >
                      <CheckIcon className="w-4 h-4" />
                      Set as Active
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(version._id)}
                    disabled={isDeleting}
                    className="text-destructive focus:text-destructive"
                  >
                    <TrashIcon className="w-4 h-4 text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

VersionCard.displayName = "VersionCard";
