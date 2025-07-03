"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PromptCard } from "@/components/prompt/prompt-card";
import { useGetAllPrompts } from "@/lib/queries/prompt";
import { PromptCardSkeleton } from "@/components/skeletons/PromptCardSkeleton";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function PromptListPage() {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Prompts</h1>
        <Button asChild>
          <Link href="/dashboard/prompts/new">+ New Prompt</Link>
        </Button>
      </div>
      {/* 
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
          </div> */}
    </div>
  );
}
