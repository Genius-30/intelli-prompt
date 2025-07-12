"use client";

import { PromptCard } from "@/components/prompt/PromptCard";
import { useGetAllPrompts } from "@/lib/queries/prompt";
import { PromptCardSkeleton } from "@/components/skeletons/PromptCardSkeleton";

export default function PromptList() {
  const { data: prompts, isLoading, error } = useGetAllPrompts();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load prompts</p>;
  }

  return (
    <div className="p-2 sm:p-6">
      {prompts?.length === 0 && (
        <p className="text-start text-muted-foreground mt-10">
          You haven't created any prompts yet.
        </p>
      )}
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt: any) => (
          <PromptCard key={prompt._id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}
