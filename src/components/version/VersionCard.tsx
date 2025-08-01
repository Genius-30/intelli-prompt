"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, Clock, MoreVertical, Share, SquarePenIcon, TrashIcon, Zap } from "lucide-react";
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
  ({ version, onSetActive, onDelete, isActivating, isDeleting, isLatest = false }, ref) => {
    const isActive = version.isActive;
    const isFavorite = version.isFavorite;
    const pathname = usePathname();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const { mutate: toggleFavorite, isPending } = useToggleFavoriteVersion();

    return (
      <>
        <Card ref={ref} className={`py-4 transition-all duration-200 hover:shadow-sm`}>
          <CardContent className="px-6">
            <div className="flex items-start justify-between gap-4">
              {/* Version Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm font-medium">
                    v{version.versionNumber}
                  </span>

                  {/* Show multiple status badges */}
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="rounded-lg border-2 border-blue-600/20 px-2 py-0.5 text-xs font-semibold text-blue-600">
                        Active
                      </span>
                    )}
                    {isFavorite && (
                      <span className="rounded-lg border-2 border-amber-600/20 px-2 py-0.5 text-xs font-semibold text-amber-600">
                        Favorite
                      </span>
                    )}
                    {isLatest && (
                      <span className="rounded-lg border-2 border-emerald-600/20 px-2 py-0.5 text-xs font-semibold text-emerald-600">
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

                <p className="text-foreground line-clamp-2 text-sm leading-relaxed">
                  {version.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
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
                      className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    >
                      <Link href={`${pathname}/${version._id}`}>
                        <SquarePenIcon className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    >
                      <Link href={`${pathname}/${version._id}/test`}>
                        <Zap className="mr-1 h-3 w-3" />
                        Test
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsShareModalOpen(true)}
                      className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    >
                      <Share className="mr-1 h-3 w-3" />
                      Share
                    </Button>

                    {/* Dropdown for more options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {!isActive && (
                          <DropdownMenuItem
                            onClick={() => onSetActive(version._id)}
                            disabled={isActivating}
                            className="text-xs"
                          >
                            <CheckIcon className="mr-2 h-3 w-3" />
                            Set as Active
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete(version._id)}
                          disabled={isDeleting}
                          className="text-destructive focus:text-destructive text-xs"
                        >
                          <TrashIcon className="mr-2 h-3 w-3" />
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
  },
);

VersionCard.displayName = "VersionCard";
