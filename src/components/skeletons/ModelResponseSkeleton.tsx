import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AI_MODELS } from "@/lib/constants";

interface ModelResponseSkeletonProps {
  provider: keyof typeof AI_MODELS;
  model: string;
}

export function ModelResponseSkeleton({
  provider,
  model,
}: ModelResponseSkeletonProps) {
  const color = AI_MODELS[provider]?.color || "#ccc";

  return (
    <Card className="overflow-hidden border" style={{ borderColor: color }}>
      <CardHeader className="flex justify-between items-center bg-muted px-4 py-2">
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-sm capitalize flex items-center gap-2">
            <Badge style={{ backgroundColor: color }}>
              {provider.toUpperCase()}
            </Badge>
            <span className="text-foreground">{model}</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Temperature:{" "}
            <Skeleton className="inline-block w-8 h-3 align-middle ml-1" />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[85%]" />
      </CardContent>
    </Card>
  );
}
