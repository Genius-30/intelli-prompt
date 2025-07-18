"use client";

import { PromptCard } from "@/components/prompt/PromptCard";
import { PromptCardSkeleton } from "@/components/skeletons/PromptCardSkeleton";
import { useGetAllFolders } from "@/lib/queries/folder";

export default function FolderList() {
  const { data: folders, isLoading, error } = useGetAllFolders();

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
    return <p className="text-red-500">Failed to load folders</p>;
  }

  return (
    <div className="p-2 sm:p-6">
      {folders?.length === 0 && (
        <p className="text-start text-muted-foreground mt-10">
          You haven't created any folders yet.
        </p>
      )}
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder: any) => (
          <PromptCard key={folder._id} prompt={folder} />
        ))}
      </div>
    </div>
  );
}
