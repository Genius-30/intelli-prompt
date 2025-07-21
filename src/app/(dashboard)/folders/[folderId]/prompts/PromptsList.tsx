"use client";

import PromptCard from "@/components/prompt/PromptCard";
import PromptCardSkeleton from "@/components/skeletons/PromptCardSkeleton";
import { useGetPromptsByFolder } from "@/lib/queries/prompt";
import { useParams } from "next/navigation";

export default function PromptsList() {
  const { folderId } = useParams();

  const { data, isPending, isError } = useGetPromptsByFolder(
    folderId as string
  );

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <PromptCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Failed to load prompts. Please try again.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No prompts found in this folder.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((prompt) => (
        <PromptCard key={prompt.id} {...prompt} />
      ))}
    </div>
  );
}
