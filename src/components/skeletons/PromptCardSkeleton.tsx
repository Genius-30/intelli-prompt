"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Clock,
  DivideCircle,
  ExternalLink,
  GitBranch,
  Loader2,
  Trash2,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import FavoriteButton from "../common/FavoriteButton";
import { Skeleton } from "../ui/skeleton";

export default function PromptCard() {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Active Version Content Preview */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-1" />
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}
