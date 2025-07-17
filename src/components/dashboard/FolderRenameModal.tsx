"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRenameFolder } from "@/lib/queries/folder";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, "Folder title is required."),
});

type FormValues = z.infer<typeof formSchema>;

type RenameFolderModalProps = {
  readonly folder: { _id: string; title: string };
  readonly open: boolean;
  readonly onClose: () => void;
};

export function FolderRenameModal({
  folder,
  open,
  onClose,
}: RenameFolderModalProps) {
  const { mutate: renameFolder, isPending } = useRenameFolder();
  const [initialTitle, setInitialTitle] = useState(folder.title);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: folder.title },
  });

  useEffect(() => {
    form.reset({ title: folder.title });
    setInitialTitle(folder.title);
  }, [folder, form]);

  const handleSubmit = (values: FormValues) => {
    const trimmed = values.title.trim();

    if (!trimmed || trimmed === initialTitle) {
      onClose();
      return;
    }

    renameFolder(
      { _id: folder._id, title: trimmed },
      {
        onSuccess: () => {
          toast.success("Folder renamed");
          onClose();
        },
        onError: () => toast.error("Failed to rename folder"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader />} Rename
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
