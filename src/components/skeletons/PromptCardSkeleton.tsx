import { Card, CardContent, CardHeader } from "../ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function PromptCardSkeleton() {
  return (
    <Card className="w-full max-w-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group gap-2">
      <CardHeader>
        <div className="w-full flex items-center justify-between gap-2">
          <h3 className="w-3/4 font-semibold text-lg leading-tight">
            <Skeleton className="h-6 w-full" />
          </h3>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-4" />
            <span>
              <Skeleton className="h-4 w-16" />
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-4" />
            <span>
              <Skeleton className="h-4 w-16" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
