"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface SharedPromptCardProps {
  prompt: {
    id: number;
    title: string;
    description: string;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    tags: string[];
    modelUsed?: string;
    likes: number;
    comments: number;
    saves: number;
    timeAgo: string;
  };
  showTrendingIndicator?: boolean;
  showUser?: boolean;
}

export function SharedPromptCard({
  prompt,
  showTrendingIndicator = false,
  showUser = true,
}: SharedPromptCardProps) {
  const router = useRouter();

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/prompts/${prompt.id}`;
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
  }, [prompt.id, prompt.title]);

  return (
    <Card className="border border-primary/10 hover:border-primary/20 hover:shadow-md transition-all duration-200 relative overflow-hidden">
      {/* Trending indicator */}
      {showTrendingIndicator && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-primary/20 to-transparent w-20 h-20 flex items-start justify-end p-2">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
      )}

      <CardContent className="px-6">
        {/* Header: Author Info */}
        {showUser && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage
                  src={prompt.author.avatar || "/placeholder.svg"}
                  alt={prompt.author.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {prompt.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">
                    {prompt.author.name}
                  </span>
                  <Link
                    href={`/user/${prompt.author.username}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    @{prompt.author.username}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    • {prompt.timeAgo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-3 mb-4">
          <Link
            href={`/prompts/${prompt.id}`}
            className="block w-fit text-lg font-semibold hover:text-primary cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
            tabIndex={0}
          >
            {prompt.title}
          </Link>
          <p className="text-muted-foreground leading-relaxed">
            {prompt.description}
          </p>
        </div>

        {/* Tags & Model */}
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.modelUsed && (
            <Badge
              variant="outline"
              className="text-xs border border-primary text-primary"
            >
              Model: {prompt.modelUsed}
            </Badge>
          )}
          {prompt.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-3 py-1 hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-border/50 gap-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            >
              <Heart className="h-4 w-4 mr-2" />
              {prompt.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {prompt.comments}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-950/20"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {prompt.saves}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/run/${prompt.id}`)}
              className="text-xs"
            >
              <Play className="h-4 w-4 mr-1" />
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
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
