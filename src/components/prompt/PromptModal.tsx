"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "../ui/loader";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  defaultTitle?: string;
  isPending?: boolean;
  submitText?: string;
}

// Zod schema
const formSchema = z.object({
  title: z.string().min(1, "Prompt title is required."),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function PromptModal({
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
