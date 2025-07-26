"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckIcon,
  Clock,
  MoreVertical,
  Share,
  SquarePenIcon,
  TrashIcon,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { forwardRef, useState } from "react";

import { Button } from "@/components/ui/button";
import FavoriteButton from "../common/FavoriteButton";
import Link from "next/link";
import { SharePromptModal } from "../community/SharePromptModal";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";
import { useToggleFavoriteVersion } from "@/lib/queries/version";

interface Version {
  _id: string;
  ownerId: string;
  promptId: string;
  versionNumber: number;
  content: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VersionCardProps {
  version: Version;
  onSetActive: (versionId: string) => void;
  onDelete: (versionId: string) => void;
  isActivating: boolean;
  isDeleting: boolean;
  isLatest?: boolean;
}

export const VersionCard = forwardRef<HTMLDivElement, VersionCardProps>(
  (
    {
      version,
      onSetActive,
      onDelete,
      isActivating,
      isDeleting,
      isLatest = false,
    },
    ref
  ) => {
    const isActive = version.isActive;
    const isFavorite = version.isFavorite;
    const pathname = usePathname();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const { mutate: toggleFavorite, isPending } = useToggleFavoriteVersion();

    return (
      <>
        <Card
          ref={ref}
          className={`transition-all hover:shadow-sm duration-200 py-4`}
        >
          <CardContent className="px-6">
            <div className="flex items-start justify-between gap-4">
              {/* Version Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    v{version.versionNumber}
                  </span>

                  {/* Show multiple status badges */}
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="text-xs font-semibold text-blue-600 border-2 border-blue-600/20 px-2 py-0.5 rounded-lg">
                        Active
                      </span>
                    )}
                    {isFavorite && (
                      <span className="text-xs font-semibold text-amber-600 border-2 border-amber-600/20 px-2 py-0.5 rounded-lg">
                        Favorite
                      </span>
                    )}
                    {isLatest && (
                      <span className="text-xs font-semibold text-emerald-600 border-2 border-emerald-600/20 px-2 py-0.5 rounded-lg">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="ml-auto">
                    <FavoriteButton
                      isFavorite={version.isFavorite}
                      isPending={isPending}
                      onClick={() => toggleFavorite(version._id)}
                    />
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                  {version.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(version.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Minimal Action Buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`${pathname}/${version._id}`}>
                        <SquarePenIcon className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`${pathname}/${version._id}/test`}>
                        <Zap className="w-3 h-3 mr-1" />
                        Test
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsShareModalOpen(true)}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </Button>

                    {/* Dropdown for more options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {!isActive && (
                          <DropdownMenuItem
                            onClick={() => onSetActive(version._id)}
                            disabled={isActivating}
                            className="text-xs"
                          >
                            <CheckIcon className="w-3 h-3 mr-2" />
                            Set as Active
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete(version._id)}
                          disabled={isDeleting}
                          className="text-xs text-destructive focus:text-destructive"
                        >
                          <TrashIcon className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Share Prompt Modal */}
        <SharePromptModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          promptContent={version.content}
          versionId={version._id}
        />
      </>
    );
  }
);

VersionCard.displayName = "VersionCard";
