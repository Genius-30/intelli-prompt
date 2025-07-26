"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface FolderCardProps {
  readonly folder: {
    readonly _id: string;
    readonly title: string;
    readonly updatedAt: string;
    readonly promptCount?: number;
  };
}

export function FolderCard({ folder }: FolderCardProps) {
  const router = useRouter();

  const goToFolder = () => {
    router.push(`/folders/${folder._id}/prompts`);
  };

  const goToNewPrompt = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent card click
    router.push(`/folders/${folder._id}/prompts/new`);
  };

  return (
    <Card
      onClick={goToFolder}
      className={`hover:shadow-lg transition-shadow border border-border/50 gap-2 ${
        folder.promptCount !== 0 ? "cursor-pointer" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2 truncate">
          <FolderIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-medium truncate">
            {folder.title}
          </CardTitle>
        </div>

        {typeof folder.promptCount === "number" && folder.promptCount > 0 ? (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {folder.promptCount} prompt{folder.promptCount !== 1 && "s"}
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={goToNewPrompt}
            className="text-xs h-7 px-2 cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Create Prompt
          </Button>
        )}
      </CardHeader>

      <CardContent className="text-xs text-muted-foreground pt-0">
        <p>Updated {formatDistanceToNow(new Date(folder.updatedAt))} ago</p>
      </CardContent>
    </Card>
  );
}
