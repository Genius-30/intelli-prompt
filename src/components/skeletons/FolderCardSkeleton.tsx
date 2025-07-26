import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function FolderCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 w-full">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-40" />
        </CardTitle>
        <Skeleton className="h-4 w-10 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}
