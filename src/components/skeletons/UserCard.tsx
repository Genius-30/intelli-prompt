import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function UserCardSkeleton() {
  return (
    <Card className="p-4">
      <CardContent className="flex items-center gap-4 p-0">
        {/* Avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />

        {/* Name and username */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>

        {/* Rank badge */}
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardContent>
    </Card>
  );
}
