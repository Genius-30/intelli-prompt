import { Skeleton } from "@/components/ui/skeleton";

export default function EditVersionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>

      {/* Content + Enhancer Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-md" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    </div>
  );
}
