import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <Card>
      <CardHeader className="px-4">
        <Skeleton className="aspect-video rounded-t-lg" />
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="border-border/50 flex items-center justify-between border-t pt-2">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
