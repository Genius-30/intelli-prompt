import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function CommentItemSkeleton() {
  return (
    <div className="bg-muted/40 border-muted space-y-3 rounded-md border px-4 py-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <Skeleton className="h-8 w-8 rounded-full" />
        </Avatar>
        <div className="flex flex-col">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-1 h-3 w-16" />
        </div>
        <Skeleton className="ml-auto h-6 w-6 rounded-md" />
      </div>

      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />

      <div className="mt-2 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>
  );
}
