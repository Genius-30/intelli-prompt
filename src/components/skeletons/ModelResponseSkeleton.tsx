import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Skeleton } from "@/components/ui/skeleton";

type ProviderKey = keyof typeof AI_MODELS;

interface ModelResponseSkeletonProps {
  provider: ProviderKey;
  model: string;
}

export function ModelResponseSkeleton({
  provider,
  model,
}: ModelResponseSkeletonProps) {
  const providerData = AI_MODELS[provider];
  const IconComponent = providerData?.icon;
  const color = providerData?.color || "#6b7280";

  return (
    <Card
      className="border-l-4 animate-pulse"
      style={{ borderLeftColor: color }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              {IconComponent && (
                <IconComponent
                  className="w-4 h-4 opacity-50"
                  style={{ color: color }}
                />
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
      <CardContent className="pt-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
