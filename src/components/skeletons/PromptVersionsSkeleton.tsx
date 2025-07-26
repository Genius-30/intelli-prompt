import { Skeleton } from "@/components/ui/skeleton";

export function PromptVersionsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="border rounded-lg">
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="p-3">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <div className="overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-6 h-6 rounded-full border" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 border-t bg-muted/30">
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="py-4 px-6 rounded-lg border bg-card shadow-sm space-y-3"
          >
            {/* Top Row: Version Info and Tags */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-12 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>

            {/* Content Preview */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Footer: Timestamp + Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>

              <div className="flex items-center gap-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-6 w-14 rounded" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
