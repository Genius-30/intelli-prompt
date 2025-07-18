"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Folder, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetAllFolders } from "@/lib/queries/folder";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FolderSelectModal() {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const router = useRouter();
  const { data: folders = [], isLoading, isError } = useGetAllFolders();

  const handleContinue = () => {
    if (!selectedFolder) return;
    router.push(`/folders/${selectedFolder}/prompts/new`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          New Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Folder
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose a folder where the new prompt will be added.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {(() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading folders...
                </div>
              );
            }
            if (isError) {
              return (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-red-500">
                    Failed to load folders.
                  </p>
                </div>
              );
            }
            if (folders.length === 0) {
              return (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground italic">
                    No folders available. Please create a folder first.
                  </p>
                </div>
              );
            }
            return (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {folders.map((folder: any) => (
                  <button
                    key={folder._id}
                    onClick={() => setSelectedFolder(folder._id)}
                    className={cn(
                      "w-full flex items-center gap-3 py-2 px-3 rounded-lg border-2 transition-all duration-200 text-left hover:bg-muted/50",
                      selectedFolder === folder._id
                        ? "border-primary bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-md",
                        selectedFolder === folder._id
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Folder className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "font-medium",
                          selectedFolder === folder._id
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {folder.title}
                      </p>
                    </div>
                    {selectedFolder === folder._id && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        <DialogFooter className="pt-4">
          <Button
            disabled={!selectedFolder}
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
