"use client";

import { FolderCard } from "@/components/folder/FolderCard";
import { FolderCardSkeleton } from "@/components/skeletons/FolderCardSkeleton";
import { useGetAllFolders } from "@/lib/queries/folder";

export default function FolderList() {
  const { data: folders, isPending, error } = useGetAllFolders();

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <FolderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load folders</p>;
  }

  return (
    <div className="p-2">
      {folders?.length === 0 && (
        <p className="text-start text-muted-foreground mt-10">
          You haven't created any folders yet.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder: any) => (
          <FolderCard key={folder._id} folder={folder} />
        ))}
      </div>
    </div>
  );
}
