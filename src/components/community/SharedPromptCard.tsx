"use client";

import {
  Bookmark,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SharedPrompt } from "@/types/sharedPrompt";

type Props = {
  readonly prompt: SharedPrompt;
};

export function SharedPromptCard({ prompt }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow py-4 px-6">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{prompt.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {prompt.content.length > 100
                ? `${prompt.content.slice(0, 100)}...`
                : prompt.content}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {prompt.likes.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              {prompt.saves.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {prompt.comments.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              {prompt.shares.length || 0}
            </span>
            <Badge variant="outline" className="text-xs">
              {prompt.modelUsed}
            </Badge>
          </div>
          <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
