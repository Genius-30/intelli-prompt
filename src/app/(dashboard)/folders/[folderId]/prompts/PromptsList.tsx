"use client";

import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import PromptCard from "@/components/prompt/PromptCard";
import PromptCardSkeleton from "@/components/skeletons/PromptCardSkeleton";
import { useGetPromptsByFolder } from "@/lib/queries/prompt";

export default function PromptsList() {
  const { folderId } = useParams();
  const pathname = usePathname();

  const {
    data: prompts,
    isPending,
    isError,
  } = useGetPromptsByFolder(folderId as string);

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
      <div className="border rounded-md p-6 bg-destructive/5 border-destructive text-destructive">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">Failed to load prompts</h2>
            <p className="text-sm text-destructive/80">
              Something went wrong. Please try again later.
            </p>
          </div>
          <Button asChild variant="destructive">
            <Link href={pathname}>Retry</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="border rounded-md p-6 bg-muted/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              No Prompts Found
            </h2>
            <p className="text-sm text-muted-foreground">
              You haven’t created any prompts in this folder yet.
            </p>
          </div>
          <Button asChild>
            <Link href={`${pathname}/new`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Prompt
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard key={prompt._id} {...prompt} />
      ))}
    </div>
  );
}
