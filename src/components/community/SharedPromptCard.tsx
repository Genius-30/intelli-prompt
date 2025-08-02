"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Heart, MessageCircle, Play, Share2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SharedPromptCardProps } from "@/types/sharedPrompt";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function SharedPromptCard({
  prompt,
  showTrendingIndicator = false,
  showUser = true,
}: SharedPromptCardProps) {
  console.log(prompt);

  const router = useRouter();

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/prompts/${prompt._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: prompt.title,
          text: "Check out this prompt!",
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  }, [prompt._id, prompt.title]);

  return (
    <Card className="border-primary/10 hover:border-primary/20 relative overflow-hidden border transition-all duration-200 hover:shadow-md">
      {/* Trending indicator */}
      {showTrendingIndicator && (
        <div className="from-primary/20 absolute top-0 right-0 flex h-20 w-20 items-start justify-end bg-gradient-to-l to-transparent p-2">
          <TrendingUp className="text-primary h-4 w-4" />
        </div>
      )}

      <CardContent className="px-6">
        {/* Header: Author Info */}
        {showUser && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="ring-primary/20 h-10 w-10 ring-2">
                <AvatarImage src={prompt.owner.avatar || ""} alt={prompt.owner.username} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {prompt.owner.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/u/${prompt.owner.username}`}
                    className="text-muted-foreground text-sm hover:underline"
                  >
                    @{prompt.owner.username}
                  </Link>
                  <span className="text-muted-foreground text-sm">• {prompt.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-4 space-y-3">
          <Link
            href={`/prompts/${prompt._id}`}
            className="hover:text-primary focus:ring-primary block w-fit cursor-pointer rounded text-lg font-semibold transition-colors focus:ring-2 focus:outline-none"
            tabIndex={0}
          >
            {prompt.title}
          </Link>
          <p className="text-muted-foreground leading-relaxed">{prompt.content}</p>
        </div>

        {/* Tags & Model */}
        <div className="mb-4 flex flex-wrap gap-2">
          {prompt.modelUsed && (
            <Badge variant="outline" className="border-primary text-primary border text-xs">
              Model: {prompt.modelUsed}
            </Badge>
          )}
          {prompt.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:bg-primary/10 hover:text-primary cursor-pointer px-3 py-1 text-xs transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="border-border/50 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            >
              <Heart className="mr-2 h-4 w-4" />
              {prompt.likeCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {prompt.commentCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-950/20"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              {prompt.saveCount}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/run/${prompt._id}`)}
              className="text-xs"
            >
              <Play className="mr-1 h-4 w-4" />
              Test Prompt
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
              {prompt.shareCount}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
