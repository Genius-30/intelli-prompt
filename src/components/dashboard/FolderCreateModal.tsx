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
import { useEffect, useState, type ReactNode } from "react";
import { useCreateFolder } from "@/lib/queries/folder";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FolderCreateModalProps = {
  readonly children: ReactNode;
  readonly onOpenChange?: (open: boolean) => void;
};

const formSchema = z.object({
  title: z.string().min(1, "Folder title is required."),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function FolderCreateModal({ children }: FolderCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createFolder, isPending } = useCreateFolder();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ title: "" });
    }
  }, [isOpen, form]);

  const handleSubmit = (values: FormSchemaType) => {
    const trimmedTitle = values.title.trim();

    createFolder(trimmedTitle, {
      onSuccess: () => {
        toast.success("Folder created");
        setIsOpen(false);
      },
      onError: () => toast.error("Failed to create folder"),
    });
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="w-full">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
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
                      <Input placeholder="Enter folder name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader />} Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
