import { FlameIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function UserRankCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border px-4 py-4">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        {/* Rank Icon Placeholder */}
        <Skeleton className="h-6 w-6 rounded-md" />

        {/* Avatar */}
        <Skeleton className="h-11 w-11 rounded-full" />

        {/* Name & Username */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Skeleton className="h-3 w-20 rounded-md" />
            <div className="flex items-center gap-1 text-amber-500">
              <Skeleton className="h-3 w-6 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="space-y-1 text-right">
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
