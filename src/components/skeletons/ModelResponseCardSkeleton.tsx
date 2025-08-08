import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Skeleton } from "@/components/ui/skeleton";

type ProviderKey = keyof typeof AI_MODELS;

interface ModelResponseCardSkeletonProps {
  readonly provider?: ProviderKey;
}

export function ModelResponseCardSkeleton({ provider }: ModelResponseCardSkeletonProps) {
  const providerData = provider ? AI_MODELS[provider] : undefined;
  const IconComponent = providerData?.icon ?? null;
  const color = providerData?.color ?? "#6b7280";

  return (
    <Card className="animate-pulse border-l-4" style={{ borderLeftColor: color }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
              {IconComponent && (
                <IconComponent className="h-4 w-4 opacity-50" style={{ color: color }} />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
