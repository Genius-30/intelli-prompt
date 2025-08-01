"use client";

import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import PromptCard from "@/components/prompt/PromptCard";
import PromptCardSkeleton from "@/components/skeletons/PromptCardSkeleton";
import { useGetPromptsByFolder } from "@/lib/queries/prompt";

interface ActiveVersion {
  _id: string;
  content: string;
  versionNumber: number;
  isActive: boolean;
  createdAt?: string;
}

interface Prompt {
  _id: string;
  title: string;
  totalVersions: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
  activeVersion?: ActiveVersion;
}

export default function PromptsPage() {
  const { folderId } = useParams();
  const pathname = usePathname();

  const { data: prompts, isPending, isError } = useGetPromptsByFolder(folderId as string);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <PromptCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/5 border-destructive text-destructive rounded-md border p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Failed to load prompts</h2>
            <p className="text-destructive/80 text-sm">
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
      <div className="bg-muted/30 rounded-md border p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-foreground text-lg font-semibold">No Prompts Found</h2>
            <p className="text-muted-foreground text-sm">
              You haven’t created any prompts in this folder yet.
            </p>
          </div>
          <Button asChild>
            <Link href={`${pathname}/new`}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Prompt
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt: Prompt) => (
        <PromptCard key={prompt._id} {...prompt} />
      ))}
    </div>
  );
}
