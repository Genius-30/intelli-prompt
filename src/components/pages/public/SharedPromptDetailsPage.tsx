"use client";

import {
  AlertTriangle,
  Bookmark,
  Heart,
  MessageCircle,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  useGetSharedPrompt,
  useMarkSharedPromptAsShared,
  useToggleLikeSharedPrompt,
  useToggleSaveSharedPrompt,
} from "@/lib/queries/shared-prompt";
import { useParams, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "@/components/sharedPrompt/CommentsSection";
import { ConfirmDeleteSharedPrompt } from "@/components/sharedPrompt/ConfirmDeleteSharedPrompt";
import Link from "next/link";
import { ModelResponseCard } from "@/components/response/ModelResponseCard";
import { ModelResponseCardSkeleton } from "@/components/skeletons/ModelResponseCardSkeleton";
import ModelTestRunner from "@/components/common/ModelTestRunner";
import { Separator } from "@/components/ui/separator";
import { SharePromptModal } from "@/components/sharedPrompt/SharePromptModal";
import SharedPromptDetailsSkeleton from "@/components/skeletons/SharedPromptDetailsSkeleton";
import { cn } from "@/lib/utils";
import { estimateTokens } from "@/utils/tokeEstimate";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useModelResponse } from "@/lib/queries/response";
import { useOpenAuthModal } from "@/hooks/useOpenAuthModal";

export default function SharedPromptDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "response";
  const { isSignedIn } = useAuth();
  const openAuthModal = useOpenAuthModal();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(initialTab as "test" | "response" | "comments");

  const [likeData, setLikeData] = useState({ isLiked: false, likeCount: 0 });
  const [saveData, setSaveData] = useState({ isSaved: false, saveCount: 0 });
  const [commentData, setCommentData] = useState({ isCommented: false, commentCount: 0 });
  const [shareData, setShareData] = useState({ isShared: false, shareCount: 0 });

  const {
    data: prompt,
    isLoading,
    isError,
  } = useGetSharedPrompt(id as string, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: modelResponse, isLoading: isModelResponseLoading } = useModelResponse(
    prompt?.responseId as string,
    {
      enabled: (!isLoading && !!prompt?.responseId) || currentTab === "response",
    },
  );

  const toggleLike = useToggleLikeSharedPrompt(id as string);
  const toggleSave = useToggleSaveSharedPrompt(id as string);
  const markShared = useMarkSharedPromptAsShared(id as string);

  useEffect(() => {
    if (prompt) {
      setLikeData({ isLiked: prompt.isUserLiked, likeCount: prompt.likeCount });
      setSaveData({ isSaved: prompt.isUserSaved, saveCount: prompt.saveCount });
      setCommentData({ isCommented: prompt.isUserCommented, commentCount: prompt.commentCount });
      setShareData({ isShared: prompt.isUserShared, shareCount: prompt.shareCount });
    }
  }, [prompt]);

  if (isLoading) return <SharedPromptDetailsSkeleton />;
  if (isError || !prompt)
    return (
      <div className="border-destructive bg-destructive/10 text-destructive flex flex-col items-center justify-center rounded-xl border p-6 shadow-sm">
        <AlertTriangle className="mb-2 h-10 w-10" />
        <h2 className="text-lg font-semibold">Prompt Not Found</h2>
        <p className="text-muted-foreground mt-1 text-center text-sm">
          We couldn’t find the prompt you’re looking for. It might have been removed or never
          existed.
        </p>
      </div>
    );

  const tokenEstimated = estimateTokens(prompt.content);

  const handleLike = () => {
    if (!isSignedIn) return openAuthModal();
    toggleLike.mutate(undefined, {
      onSuccess: (data) => setLikeData({ isLiked: data.isLiked, likeCount: data.likesCount }),
    });
  };

  const handleSave = () => {
    if (!isSignedIn) return openAuthModal();
    toggleSave.mutate(undefined, {
      onSuccess: (data) => setSaveData({ isSaved: data.isSaved, saveCount: data.savesCount }),
    });
  };

  const handleComment = () => {
    setCurrentTab("comments");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/prompts/${id}`;

    if (!isSignedIn) {
      openAuthModal();
      return;
    }

    const maybeMarkShared = () => {
      if (!shareData.isShared) {
        markShared.mutate(undefined, {
          onSuccess: (data) =>
            setShareData({ isShared: data.isShared, shareCount: data.sharesCount }),
        });
      }
    };

    if (navigator.share) {
      navigator
        .share({ title: prompt.title, text: "Check out this prompt!", url })
        .then(maybeMarkShared)
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      maybeMarkShared();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={prompt.owner.avatar || ""} alt={prompt.owner.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {prompt.owner.username
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/u/${prompt.owner.username}`}
              className="hover:text-primary text-md font-medium"
            >
              @{prompt.owner.username}
            </Link>
            <p className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(prompt.createdAt))} ago
            </p>
          </div>
        </div>
        {isSignedIn && prompt.isUserOwned && (
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
              <Button variant="ghost" size="icon" title="Delete" className="hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConfirmDeleteSharedPrompt>
          </div>
        )}
      </div>

      {/* Title & Tags */}
      <h1 className="mb-2 font-bold sm:text-2xl">{prompt.title}</h1>

      {/* Prompt Content */}
      <pre className="bg-muted/50 sm:text-md overflow-x-auto rounded-lg border px-4 py-2">
        <code className="text-foreground font-mono whitespace-pre-wrap">{prompt.content}</code>
      </pre>

      <div className="my-4 flex flex-wrap gap-2">
        {prompt.tags.map((tag: string) => (
          <Badge key={tag} variant="secondary">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <Heart className={cn("mr-1 h-4 w-4", likeData.isLiked && "fill-foreground")} />
            <span>{likeData.likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleComment}>
            <MessageCircle
              className={cn("mr-1 h-4 w-4", commentData.isCommented && "fill-foreground")}
            />
            <span>{commentData.commentCount}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className={cn("mr-1 h-4 w-4", shareData.isShared && "fill-foreground")} />
            <span>{shareData.shareCount}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Bookmark className={cn("mr-1 h-4 w-4", saveData.isSaved && "fill-foreground")} />
            <span>{saveData.saveCount}</span>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Prompt Response, Comments, Run Test Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as "test" | "response" | "comments")}
        className="space-y-2"
      >
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="test" className="md:px-4">
            Run Prompt
          </TabsTrigger>
          <TabsTrigger value="response" className="md:px-4">
            Model Response
          </TabsTrigger>
          <TabsTrigger value="comments" className="md:px-4">
            Comments
          </TabsTrigger>
        </TabsList>

        {/* Prompt Test Tab */}
        {currentTab === "test" && (
          <TabsContent value="test">
            <ModelTestRunner
              versionId={prompt.versionId || ""}
              content={prompt.content}
              tokenEstimated={tokenEstimated}
            />
          </TabsContent>
        )}

        {/* Model Response Tab */}
        {currentTab === "response" && (
          <TabsContent value="response">
            <div>
              <h2 className="text-lg font-semibold">Model Response</h2>
              <p className="text-muted-foreground mb-2 text-sm">
                This is the response generated by the model when this prompt was run.
              </p>
              {isModelResponseLoading ? (
                <ModelResponseCardSkeleton />
              ) : (
                <ModelResponseCard
                  model={modelResponse.model}
                  temperature={modelResponse.temperature}
                  response={modelResponse.response}
                  isInitiallyExpanded
                />
              )}
            </div>
          </TabsContent>
        )}

        {/* Comments Tab */}
        {currentTab === "comments" && (
          <TabsContent value="comments">
            <CommentsSection
              promptId={id as string}
              isSignedIn={isSignedIn}
              openAuthModal={openAuthModal}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Share/Edit Modal */}
      {isSignedIn && prompt.isUserOwned && (
        <SharePromptModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          promptContent={prompt.content}
          versionId={prompt.versionId || ""}
          isEdit
          sharedPromptId={prompt._id}
          initialData={{
            title: prompt.title,
            tags: prompt.tags,
            responseId: prompt.responseId,
          }}
        />
      )}
    </div>
  );
}
