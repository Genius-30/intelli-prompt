import { Skeleton } from "../ui/skeleton";

export const VersionsSkeleton = () => {
  return (
    <div className="relative pb-10 ml-4 sm:ml-8">
      {/* Dot */}
      <span className="absolute -left-[24px] top-[8px] z-10">
        <span className="relative block w-4 h-4 bg-muted-foreground/20 border-2 border-muted rounded-full" />
      </span>

      <div className="pl-6 pr-4 pt-2 pb-3 bg-background rounded-lg shadow-sm border border-muted relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <Skeleton className="h-3 w-36 mt-2" />

        <div className="mt-3 flex gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};
