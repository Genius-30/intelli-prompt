"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Info } from "lucide-react";

export function VersionLegend() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Info className="w-3 h-3" />
            Guide
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-xs bg-muted border-muted"
          arrowClassName="bg-muted fill-muted"
        >
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-blue-500 rounded-sm"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-amber-500 rounded-sm"></div>
                <span>Favorite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-emerald-500 rounded-sm"></div>
                <span>Latest</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
