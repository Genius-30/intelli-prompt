"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PromptCard } from "@/components/prompt/PromptCard";
import { useGetAllPrompts } from "@/lib/queries/prompt";
import { PromptCardSkeleton } from "@/components/skeletons/PromptCardSkeleton";
import { useState } from "react";

export default function AllPromptsPage() {
  const [prompts, setPrompts] = useState([
    {
      _id: "678fg7d812356ef12345678",
      title: "Cold Email",
      isFavorite: true,
      totalVersions: 3,
      updatedAt: "2025-07-04T10:23:00Z",
      activeVersion: {
        _id: "v456",
      },
    },
    {
      _id: "1234567890abcdef12345678",
      title: "Robot Story",
      isFavorite: true,
      totalVersions: 5,
      updatedAt: "2025-07-04T16:39:00Z",
      activeVersion: {
        _id: "v25",
      },
    },
  ]);
  // const { data: prompts, isLoading, error } = useGetAllPrompts();

  // if (isLoading) {
  //   return (
  //     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  //       {[...Array(6)].map((_, i) => (
  //         <PromptCardSkeleton key={i} />
  //       ))}
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <p className="text-red-500">Failed to load prompts</p>;
  // }

  return (
    <div className="p-2 sm:p-6">
      {prompts?.length === 0 && (
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
