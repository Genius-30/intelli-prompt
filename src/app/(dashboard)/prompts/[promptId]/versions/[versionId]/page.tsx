"use client";

import { PromptForm } from "@/components/prompt/prompt-form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TestTube2Icon } from "lucide-react";
import { useGetVersion } from "@/lib/queries/version";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const versionId = params?.versionId as string | undefined;

  const { data, isLoading, isError } = useGetVersion(versionId);

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
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
