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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "../ui/loader";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdatePrompt } from "@/lib/queries/prompt";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface UpdatePromptTitleModalProps {
  promptId: string;
  currentTitle: string;
}

const promptSchema = z.object({
  title: z.string().min(1, "Prompt title is required."),
});

type PromptSchemaType = z.infer<typeof promptSchema>;

export default function UpdatePromptTitleModal({
  promptId,
  currentTitle,
}: UpdatePromptTitleModalProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<PromptSchemaType>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: currentTitle,
    },
  });

  const { mutate: updatePrompt, isPending } = useUpdatePrompt();

  const handleSubmit = () => {
    const newTitle = form.getValues("title").trim();

    if (!newTitle) return;
    if (newTitle === currentTitle) {
      setOpen(false);
      return;
    }

    updatePrompt(
      { promptId, newTitle },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Prompt</DialogTitle>
          <DialogDescription>Modify the title of your prompt.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter folder title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader />} Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
