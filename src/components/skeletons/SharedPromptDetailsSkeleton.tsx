import { Skeleton } from "@/components/ui/skeleton";

export default function SharedPromptDetailsSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Title */}
      <Skeleton className="mb-4 h-6 w-3/4" />

      {/* Prompt Content */}
      <Skeleton className="mb-4 h-[160px] w-full rounded-lg" />

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-12 rounded-md" />
          <Skeleton className="h-8 w-12 rounded-md" />
          <Skeleton className="h-8 w-12 rounded-md" />
          <Skeleton className="h-8 w-12 rounded-md" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      {/* Separator */}
      <Skeleton className="my-6 h-px w-full" />
    </div>
  );
}
