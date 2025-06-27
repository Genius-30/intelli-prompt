"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PromptCard } from "@/components/prompt/prompt-card";
import { usePrompts } from "@/lib/query/prompts";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromptListPage() {
  const { data: prompts, isLoading, error } = usePrompts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    );
  }

  if (error || !prompts) {
    return <p className="text-red-500">Failed to load prompts</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Prompts</h1>
        <Button asChild>
          <Link href="/dashboard/prompts/new">+ New Prompt</Link>
        </Button>
      </div>

      {prompts.length === 0 && (
        <p className="text-start text-muted-foreground mt-10">
          {" "}
          You haven't created any prompts yet.
        </p>
      )}
      <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {prompts.map((prompt: any) => (
          <PromptCard key={prompt._id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}
