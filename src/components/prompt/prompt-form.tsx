"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreatePrompt, useUpdatePrompt } from "@/lib/mutations/prompt";
import { extractPromptVariables } from "@/utils/extractVariables";
import { Loader } from "../ui/loader";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

type PromptData = {
  _id?: string;
  title: string;
  prompt: string;
};

export function PromptForm({
  initialData,
}: Readonly<{ initialData?: PromptData }>) {
  const isEditing = !!initialData;

  const createPromptMutation = useCreatePrompt();
  const updatePromptMutation = useUpdatePrompt();

  const mutation = isEditing ? updatePromptMutation : createPromptMutation;
  const { mutate, isPending } = mutation;

  const [title, setTitle] = useState(initialData?.title || "");
  const [prompt, setPrompt] = useState(initialData?.prompt || "");
  const [variables, setVariables] = useState<string[]>([]);

  useEffect(() => {
    const detected = extractPromptVariables(prompt);

    setVariables(detected);
  }, [prompt]);

  const duplicateVars = variables.filter((v, i, arr) => arr.indexOf(v) !== i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (duplicateVars.length > 0) {
      toast.error("Please fix duplicate variable names before saving.");
      return;
    }

    const payload = {
      title,
      prompt,
      variables,
      ...(isEditing && { id: initialData?._id }), // only send id if updating
    };

    mutation.mutate(payload);
  };

  const buttonLabel = initialData ? "Update Prompt" : "Save Prompt";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label>Prompt Title</Label>
        <Input
          placeholder="e.g. Product Description Generator"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Prompt Template */}
      <div>
        <div className="flex items-center gap-1">
          <Label>Prompt Template</Label>
          <Tooltip>
            <TooltipTrigger>
              <CircleAlert className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              Use <code>{`{{your_variable}}`}</code> format to define dynamic
              placeholders.
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          rows={6}
          placeholder="e.g. Write a tweet about {{product}}"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-2 h-auto min-h-32 md:min-h-48"
        />
      </div>

      {/* Variables */}
      <div className="flex flex-wrap gap-2 mt-2">
        {[...new Set(variables)].map((variable) => (
          <Badge key={variable} variant="secondary" className="px-3 py-1">
            {variable}
          </Badge>
        ))}
      </div>

      {duplicateVars.length > 0 && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <CircleAlert className="w-4 h-4" />
          Duplicate variable name(s): {duplicateVars.join(", ")} — please ensure
          each variable is unique.
        </p>
      )}

      {/* Save Button */}
      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {isPending && <Loader />}
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}
