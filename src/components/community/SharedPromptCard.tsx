"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Heart, MessageCircle, Play, Share2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCallback, useState } from "react";
import {
  useMarkSharedPromptAsShared,
  useToggleLikeSharedPrompt,
  useToggleSaveSharedPrompt,
} from "@/lib/queries/shared-prompt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModelResponseDialog } from "./ModelResponseDialog";
import type React from "react";
import type { SharedPromptCardProps } from "@/types/sharedPrompt";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { getModelProviderDetails } from "@/utils/ai-model-utils";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useOpenAuthModal } from "@/hooks/useOpenAuthModal";
import { useRouter } from "next/navigation";

export function SharedPromptCard({ prompt, showUser = true }: Readonly<SharedPromptCardProps>) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const openAuthModal = useOpenAuthModal();

  const [isExpanded, setIsExpanded] = useState(false);
  const [likeData, setLikeData] = useState({
    isLiked: prompt.isUserLiked,
    likeCount: prompt.likeCount,
  });
  const [saveData, setSaveData] = useState({
    isSaved: prompt.isUserSaved,
    saveCount: prompt.saveCount,
  });
  const [commentData, setCommentData] = useState({
    isCommented: prompt.isUserCommented,
    commentCount: prompt.commentCount,
  });
  const [shareData, setShareData] = useState({
    isShared: prompt.isUserShared,
    shareCount: prompt.shareCount,
  });

  const toggleLike = useToggleLikeSharedPrompt(prompt._id);
  const toggleSave = useToggleSaveSharedPrompt(prompt._id);
  const markShared = useMarkSharedPromptAsShared(prompt._id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) return openAuthModal();
    toggleLike.mutate(undefined, {
      onSuccess: (data) => {
        setLikeData({
          isLiked: data.isLiked,
          likeCount: data.likesCount,
        });
      },
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) return openAuthModal();
    toggleSave.mutate(undefined, {
      onSuccess: (data) => {
        setSaveData({
          isSaved: data.isSaved,
          saveCount: data.savesCount,
        });
      },
    });
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) return openAuthModal();
    router.push(`/prompts/${prompt._id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/prompts/${prompt._id}`;

    const maybeMarkShared = () => {
      if (!shareData.isShared) {
        markShared.mutate(undefined, {
          onSuccess: (data) => {
            setShareData({
              isShared: data.isShared,
              shareCount: data.sharesCount,
            });
          },
        });
      }
    };

    if (navigator.share) {
      navigator
        .share({
          title: prompt.title,
          text: "Check out this prompt!",
          url,
        })
        .then(maybeMarkShared)
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      maybeMarkShared();
    }
  };

  const renderPromptContent = () => {
    return (
      <pre className="bg-muted/50 overflow-x-auto rounded-lg border px-4 py-2 text-sm">
        <code
          className={cn(
            "text-foreground line-clamp-3 font-mono whitespace-pre-wrap",
            isExpanded && "line-clamp-none",
          )}
        >
          {prompt.content}
        </code>
      </pre>
    );
  };

  return (
    <Card className="group border-border/50 hover:border-border relative overflow-hidden border py-3 transition-all duration-300 hover:shadow-lg sm:py-4">
      <CardContent className="px-3 sm:px-4">
        {/* Header: Author Info */}

        {showUser && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="ring-primary/20 group-hover:ring-primary/30 h-8 w-8 ring-2 transition-all">
                <AvatarImage src={prompt.owner.avatar || ""} alt={prompt.owner.username} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {prompt.owner.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/u/${prompt.owner.username}`}
                    className="text-foreground hover:text-primary text-sm font-medium transition-colors"
                  >
                    @{prompt.owner.username}
                  </Link>
                  <span className="text-muted-foreground text-xs">
                    • {formatDistanceToNow(new Date(prompt.createdAt))} ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Title & Tags*/}
        <div className="mb-2 flex flex-wrap items-center justify-between">
          <Link
            href={`/prompts/${prompt._id}`}
            className="text-foreground hover:text-primary xs:text-xl block rounded text-lg font-bold transition-colors"
          >
            {prompt.title}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {renderPromptContent()}

          <div className="flex flex-wrap-reverse items-center justify-between">
            <div>
              {prompt.modelUsed &&
                (() => {
                  const provider = getModelProviderDetails(prompt.modelUsed);
                  if (!provider) return null;
                  const { modelName, Icon, color } = provider;

                  return (
                    <Badge
                      variant="outline"
                      className="mt-2 flex items-center space-x-1"
                      style={{ color }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{modelName}</span>
                    </Badge>
                  );
                })()}
            </div>
            {prompt.content.length > 200 && (
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-primary hover:text-primary/80 mt-1 cursor-pointer self-end text-xs font-medium"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-border/50 flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "h-9 px-3 text-sm transition-all",
                likeData.isLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30"
                  : "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20",
              )}
            >
              <Heart className={cn("mr-1 h-4 w-4", likeData.isLiked && "fill-current")} />
              <span>{likeData.likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className={cn(
                "h-9 px-3 text-sm transition-all",
                commentData.isCommented
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"
                  : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20",
              )}
            >
              <MessageCircle
                className={cn("mr-1 h-4 w-4", commentData.isCommented && "fill-current")}
              />
              <span>{commentData.commentCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className={
                (cn("h-9 px-3 text-sm transition-all"),
                shareData.isShared
                  ? "bg-primary/5 text-primary hover:bg-primary/10"
                  : "hover:bg-primary/5 hover:text-primary")
              }
            >
              <Share2 className={cn("mr-1 h-4 w-4", shareData.isShared && "fill-current")} />
              <span>{shareData.shareCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={cn(
                "h-9 px-3 text-sm transition-all",
                saveData.isSaved
                  ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/30"
                  : "hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-950/20",
              )}
            >
              <Bookmark className={cn("mr-1 h-4 w-4", saveData.isSaved && "fill-current")} />
              <span>{saveData.saveCount}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Model Response Modal */}
            <ModelResponseDialog responseId={prompt.responseId} />

            <Button variant="outline" size="sm" onClick={() => router.push(`/run/${prompt._id}`)}>
              <Play className="mr-1 h-4 w-4" />
              Test Prompt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
