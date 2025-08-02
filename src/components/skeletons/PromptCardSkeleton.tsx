import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Skeleton } from "../ui/skeleton";

export default function PromptCardSkeleton() {
  return (
    <Card className="border-border/50 hover:border-border w-full max-w-sm transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Active Version Content Preview */}
        <div className="bg-muted/30 border-border/30 rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-5/6" />
          </div>
        </div>

        {/* Metadata */}
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
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
        <div className="flex flex-1 items-center gap-2">
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
