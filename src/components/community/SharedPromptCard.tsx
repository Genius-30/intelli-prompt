"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Heart, MessageCircle, Pencil, Play, Share2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  useMarkSharedPromptAsShared,
  useToggleLikeSharedPrompt,
  useToggleSaveSharedPrompt,
} from "@/lib/queries/shared-prompt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsDialog } from "./CommentsModal";
import { ConfirmDeleteSharedPrompt } from "./ConfirmDeleteSharedPrompt";
import Link from "next/link";
import { ModelResponseModal } from "./ModelResponseModal";
import type React from "react";
import { SharePromptModal } from "./SharePromptModal";
import type { SharedPromptCardProps } from "@/types/sharedPrompt";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useOpenAuthModal } from "@/hooks/useOpenAuthModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SharedPromptCard({ prompt, showUser = true }: Readonly<SharedPromptCardProps>) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const openAuthModal = useOpenAuthModal();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
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
    setCommentsOpen(true);
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-1">
          {showUser && (
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
              <div className="flex flex-wrap items-center space-x-2">
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
          )}
          {prompt.isUserOwned && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareModalOpen(true)}
                title="Edit"
                className="hover:text-blue-500"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <ConfirmDeleteSharedPrompt promptId={prompt._id}>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Delete"
                  className="hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </ConfirmDeleteSharedPrompt>
            </div>
          )}
        </div>

        {/* Title & Tags*/}
        <div className="mb-2 flex flex-wrap items-center justify-between">
          <Link
            href={`/prompt/${prompt._id}`}
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

          <div className="flex justify-end">
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
        <div className="border-border/50 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="text-foreground h-9 px-3 text-sm transition-all"
            >
              <Heart className={cn("mr-1 h-4 w-4", likeData.isLiked && "fill-foreground")} />
              <span>{likeData.likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="text-foreground h-9 px-3 text-sm transition-all"
            >
              <MessageCircle
                className={cn("mr-1 h-4 w-4", commentData.isCommented && "fill-foreground")}
              />
              <span>{commentData.commentCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-foreground h-9 px-3 text-sm transition-all"
            >
              <Share2 className={cn("mr-1 h-4 w-4", shareData.isShared && "fill-for")} />
              <span>{shareData.shareCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-foreground h-9 px-3 text-sm transition-all"
            >
              <Bookmark className={cn("mr-1 h-4 w-4", saveData.isSaved && "fill-foreground")} />
              <span>{saveData.saveCount}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Model Response Modal */}
            <ModelResponseModal responseId={prompt.responseId} />

            <Button variant="outline" size="sm" onClick={() => router.push(`/run/${prompt._id}`)}>
              <Play className="mr-1 h-4 w-4" />
              Test Prompt
            </Button>
          </div>
        </div>
      </CardContent>
      <CommentsDialog
        promptId={prompt._id}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        setCommentData={setCommentData}
      />
      <SharePromptModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        promptContent={prompt.content}
        versionId={prompt.versionId}
        isEdit={true}
        sharedPromptId={prompt._id}
        initialData={{
          title: prompt.title,
          tags: prompt.tags,
          responseId: prompt.responseId,
        }}
      />
    </Card>
  );
}
