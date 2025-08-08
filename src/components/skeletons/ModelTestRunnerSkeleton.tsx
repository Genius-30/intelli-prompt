import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function ModelTestRunnerSkeleton() {
  return (
    <div className="space-y-4">
      {/* Select Models Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="h-24">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Temperature & Test Button */}
      <div className="rounded-lg border">
        <div className="bg-muted/30 border-b px-3 py-2">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex flex-col justify-around gap-4 p-3 md:flex-row">
          {/* Temperature Control */}
          <div className="w-full max-w-[400px] space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          {/* Test Button */}
          <div className="flex-shrink-0">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
