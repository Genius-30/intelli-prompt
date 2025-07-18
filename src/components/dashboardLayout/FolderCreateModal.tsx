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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "../ui/loader";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (title: string) => void;
  readonly defaultTitle?: string;
  readonly isPending?: boolean;
  readonly submitText?: string;
}

// Zod schema
const formSchema = z.object({
  title: z.string().min(1, "Prompt title is required."),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function FolderCreateModal({
  open,
  onClose,
  onSubmit,
  defaultTitle = "",
  isPending = false,
  submitText = "Create",
}: Props) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle,
    },
  });

  // Sync defaultTitle with form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({ title: defaultTitle });
    }
  }, [open, defaultTitle, form]);

  const handleSubmit = (values: FormSchemaType) => {
    onSubmit(values.title.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{submitText} Prompt</DialogTitle>
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
                  <FormLabel>Prompt Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter prompt title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader />} {submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
