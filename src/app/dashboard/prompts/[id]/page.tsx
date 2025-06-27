"use client";

import { PromptForm } from "@/components/prompt/prompt-form";
import { usePromptById } from "@/lib/query/prompts";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptTester } from "@/components/prompt/prompt-tester";

export default function EditPromptPage({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = usePromptById(params.id);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-red-500 p-6">Failed to load prompt.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 mx-auto">
      <div className="flex flex-col flex-1">
        <h1 className="text-2xl font-bold mb-4">Edit Prompt</h1>
        <PromptForm initialData={data} />
      </div>
      <PromptTester />
    </div>
  );
}
