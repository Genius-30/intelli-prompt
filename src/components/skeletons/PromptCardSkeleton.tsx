import { Skeleton } from "@/components/ui/skeleton";

export function PromptCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 space-y-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Prompt Content Skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />

        {/* Footer (Updated time + buttons) */}
        <div className="flex flex-col gap-3 pt-4">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
