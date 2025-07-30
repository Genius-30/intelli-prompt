"use client";

import { Button } from "@/components/ui/button";
import { FolderCard } from "@/components/folder/FolderCard";
import { FolderCardSkeleton } from "@/components/skeletons/FolderCardSkeleton";
import Link from "next/link";
import { useGetAllFolders } from "@/lib/queries/folder";
import { usePathname } from "next/navigation";

export default function FolderList() {
  const { data: folders, isPending, error } = useGetAllFolders();
  const pathname = usePathname();

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
    return (
      <div className="border rounded-md p-6 bg-destructive/5 border-destructive text-destructive">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">Failed to load folders</h2>
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

  if (!folders || folders.length === 0) {
    return (
      <div className="border rounded-md p-6 bg-muted/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              No Folders Found
            </h2>
            <p className="text-sm text-muted-foreground">
              You haven’t created any folders yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder: any) => (
          <FolderCard key={folder._id} folder={folder} />
        ))}
      </div>
    </div>
  );
}
