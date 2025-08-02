import { Skeleton } from "../ui/skeleton";

export const VersionsSkeleton = ({ showDot = true }: { showDot?: boolean }) => {
  return (
    <div className={`${showDot ? "relative ml-4 pb-4 sm:ml-8" : ""}`}>
      {/* Dot */}
      {showDot && (
        <span className="absolute top-[16px] -left-[24px] z-10">
          <span className="border-muted bg-muted-foreground/20 relative block h-4 w-4 rounded-full border-2" />
        </span>
      )}

      <div className="border-muted bg-background rounded-lg border px-6 py-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-8 rounded-sm" />

              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>

              <div className="ml-auto">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />

              <div className="flex items-center gap-1">
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
