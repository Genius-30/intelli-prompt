"use client";

import { PromptForm } from "@/components/prompt/prompt-form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TestTube2Icon } from "lucide-react";
import { useGetPrompt } from "@/lib/queries/prompt";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = params?.id as string | undefined;

  const { data, isLoading, isError } = useGetPrompt(promptId);

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-red-600">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="w-8 h-8" />
          <p>Failed to load prompt. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Edit Prompt</h1>
        {/* Show "Test Prompt" only if editing */}
        {promptId && (
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/prompts/test/${promptId}`)}
          >
            <TestTube2Icon className="mr-2 h-4 w-4" /> Test this Prompt
          </Button>
        )}
      </div>

      <PromptForm initialData={data} />
    </div>
  );
}
