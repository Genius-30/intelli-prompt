import { Skeleton } from "@/components/ui/skeleton";

export default function RecentPromptSkeleton() {
  return (
    <div className="border-border flex items-center justify-between rounded-xl border p-4">
      <div className="flex flex-1 items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <div className="flex space-x-3 text-xs">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
