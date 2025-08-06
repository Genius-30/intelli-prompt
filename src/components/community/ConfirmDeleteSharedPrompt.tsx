"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Loader } from "../ui/loader";
import { toast } from "sonner";
import { useDeleteSharedPrompt } from "@/lib/queries/shared-prompt";
import { useState } from "react";

export function ConfirmDeleteSharedPrompt({
  children,
  promptId,
}: {
  readonly children: React.ReactNode;
  readonly promptId: string;
}) {
  const [open, setOpen] = useState(false);
  const deleteSharedPrompt = useDeleteSharedPrompt();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    deleteSharedPrompt.mutate(promptId, {
      onSuccess: () => {
        toast.success("Prompt deleted successfully");
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Shared Prompt?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)} disabled={deleteSharedPrompt.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSharedPrompt.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSharedPrompt.isPending ? (
              <>
                <Loader className="text-destructive-foreground" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
