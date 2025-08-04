"use client";

import { BarChart, MessageCircle, Sparkles, ThumbsUp, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function RankGuideModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold tracking-tight">
            How to Climb the Ranks 🏆
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="text-muted-foreground space-y-6 text-sm">
            {/* Ranking Basis */}
            <div>
              <h4 className="text-foreground text-base font-semibold">🔍 Ranking is Based On</h4>
              <ul className="mt-3 space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <Upload className="text-primary h-4 w-4" />
                  Number of prompts you've shared
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="text-primary h-4 w-4" />
                  Likes received from the community
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="text-primary h-4 w-4" />
                  Comments and discussions you've participated in
                </li>
                <li className="flex items-start gap-2">
                  <BarChart className="text-primary h-4 w-4" />
                  Engagement from others (likes, shares, saves)
                </li>
              </ul>
            </div>

            <Separator />

            {/* Improvement Tips */}
            <div>
              <h4 className="text-foreground text-base font-semibold">
                📈 Tips to Improve Your Rank
              </h4>
              <ul className="mt-3 space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Share high-quality prompts regularly
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Post in trending categories or folders
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Update prompts with new versions and better instructions
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Stay consistent — activity matters!
                </li>
              </ul>
            </div>

            <Separator />

            {/* Closing Note */}
            <div className="text-muted-foreground text-center text-sm font-medium italic">
              Your creativity deserves the spotlight.
              <br />
              <span className="text-foreground">Start contributing today and rise to the top!</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
