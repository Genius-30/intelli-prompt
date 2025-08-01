"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Info } from "lucide-react";

export function VersionLegend() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-2 py-1 text-xs transition-colors">
            <Info className="h-3 w-3" />
            Guide
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-muted border-muted max-w-xs"
          arrowClassName="bg-muted fill-muted"
        >
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm border border-blue-500"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm border border-amber-500"></div>
                <span>Favorite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm border border-emerald-500"></div>
                <span>Latest</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
