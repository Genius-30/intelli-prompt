"use client";

import { PromptForm } from "@/components/prompt/prompt-form";
import { useParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useGetVersion } from "@/lib/queries/version";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPromptPage() {
  const params = useParams();
  const versionId = params?.versionId as string | undefined;

  const { data, isPending, isError } = useGetVersion(versionId);

  if (isPending) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-3 w-full md:justify-end">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>

        {/* Prompt Textarea Section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>

        {/* Button Row */}
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-red-500">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="w-8 h-8" />
          <p>Failed to load prompt. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PromptForm initialData={data} />
    </div>
  );
}
