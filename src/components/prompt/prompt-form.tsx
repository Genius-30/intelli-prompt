"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader } from "../ui/loader";
import { ArrowRightIcon, Redo2Icon, Undo2Icon } from "lucide-react";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { toast } from "sonner";
import { enhancedPrompt } from "@/utils/enhancePrompt";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { useCreatePrompt, useUpdatePrompt } from "@/lib/queries/prompt";

type PromptData = {
  _id?: string;
  title: string;
  prompt: string;
};

export function PromptForm({
  initialData,
}: Readonly<{ initialData?: PromptData }>) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [prompt, setPrompt] = useState(initialData?.prompt || "");
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [loadingEnhance, setLoadingEnhance] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const isPromptValid = title.trim().length > 0 && prompt.trim().length > 0;

  const isUnchanged =
    initialData &&
    title.trim() === initialData.title.trim() &&
    prompt.trim() === initialData.prompt.trim();

  const disableSaveButton = !isPromptValid || (!!initialData && isUnchanged);

  const router = useRouter();
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();

  const isMutating = createPrompt.isPending || updatePrompt.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      rawPrompt: prompt,
    };

    try {
      if (initialData?._id) {
        await updatePrompt.mutateAsync({ id: initialData?._id, ...payload });
        toast.success("Prompt updated successfully!");
      } else {
        await createPrompt.mutateAsync(payload);
        toast.success("Prompt saved successfully!");
        router.push(`/dashboard/prompts`);
      }
    } catch (error) {
      console.error("Error submitting prompt:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleEnhanceClick = async () => {
    try {
      setLoadingEnhance(true);
      setShowEnhancer(true);
      setEnhancePrompt("");
      setHistory((prev) => [...prev, prompt]); // track only enhanced prompt edits
      setRedoStack([]);

      const result = await enhancedPrompt(prompt);

      if (!result || typeof result !== "string") {
        toast.error("Failed to enhance the prompt.");
        return;
      }

      setEnhancePrompt(result);
    } catch (error) {
      toast.error("Error enhancing prompt.");
      console.error("Enhance Error:", error);
    } finally {
      setLoadingEnhance(false);
    }
  };

  const buttonLabel = initialData ? "Update Prompt" : "Save Prompt";

  return (
    // <form onSubmit={handleSubmit} className="space-y-6">
    //   {/* Title */}
    //   <div>
    //     <Label>Prompt Title</Label>
    //     <Input
    //       placeholder="e.g. Product Description Generator"
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //       className="mt-2 h-10"
    //     />
    //   </div>

    //   {/* Prompt & Enhancer */}
    //   <div className="flex flex-col md:flex-row gap-6">
    //     {/* Left: Prompt Template */}
    //     <div className="flex-1">
    //       <div className="flex items-center justify-between">
    //         <Label>Prompt Template</Label>

    //         <Button
    //           type="button"
    //           variant="secondary"
    //           size="sm"
    //           onClick={handleEnhanceClick}
    //           className="group cursor-pointer select-none"
    //           disabled={loadingEnhance || !prompt.trim()}
    //         >
    //           <AnimatedShinyText className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
    //             ✨ Enhance with AI
    //             {loadingEnhance ? (
    //               <Loader className="ml-2 w-4 h-4 animate-spin text-muted-foreground" />
    //             ) : (
    //               <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    //             )}
    //           </AnimatedShinyText>
    //         </Button>
    //       </div>

    //       <Textarea
    //         rows={6}
    //         placeholder="e.g. Write a tweet about {{product}}"
    //         value={prompt}
    //         onChange={(e) => setPrompt(e.target.value)}
    //         className="mt-2 h-auto min-h-32 md:min-h-48"
    //       />
    //     </div>

    //     {/* Right: Enhanced Prompt */}
    //     {showEnhancer && (
    //       <div className="flex-1 bg-muted p-4 rounded-md space-y-2 min-h-[180px]">
    //         <p className="text-sm text-muted-foreground font-medium">
    //           ✨ Enhanced Prompt
    //         </p>
    //         <div className="bg-input dark:bg-input/30 border py-2 px-3 rounded-md text-sm min-h-[50px] flex items-center">
    //           {enhancePrompt ? (
    //             <span>{enhancePrompt}</span>
    //           ) : (
    //             <Loader className="w-6 h-6" />
    //           )}
    //         </div>
    //         <div className="flex gap-2 pt-2">
    //           <Button
    //             size="sm"
    //             onClick={() => {
    //               setHistory((prev) => [...prev.slice(-49), prompt]);
    //               setRedoStack([]);
    //               setPrompt(enhancePrompt);
    //             }}
    //           >
    //             Replace
    //           </Button>
    //           <Button
    //             size="sm"
    //             variant="ghost"
    //             onClick={() => setShowEnhancer(false)}
    //           >
    //             Discard
    //           </Button>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {/* Submit */}
    //   <div className="flex items-center gap-2 pt-4">
    //     {disableSaveButton ? (
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button type="button" variant={"outline"}>
    //             {buttonLabel}
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           {!isPromptValid
    //             ? "Title and prompt are required."
    //             : "No changes made to the prompt."}
    //         </TooltipContent>
    //       </Tooltip>
    //     ) : (
    //       <Button
    //         type="submit"
    //         disabled={isMutating}
    //         className="cursor-pointer"
    //       >
    //         {isMutating ? <Loader className="mr-2" /> : null} {buttonLabel}
    //       </Button>
    //     )}

    //     {history.length > 0 && (
    //       <Button
    //         type="button"
    //         variant="ghost"
    //         className="text-muted-foreground hover:text-foreground"
    //         onClick={() => {
    //           const last = history[history.length - 1];
    //           if (last !== undefined) {
    //             setRedoStack((prev) => [...prev.slice(-49), prompt]);
    //             setPrompt(last);
    //             setHistory((prev) => prev.slice(0, -1));
    //           }
    //         }}
    //       >
    //         <Undo2Icon className="mr-1 h-4 w-4" />
    //         Undo
    //       </Button>
    //     )}

    //     {redoStack.length > 0 && (
    //       <Button
    //         type="button"
    //         variant="ghost"
    //         className="text-muted-foreground hover:text-foreground"
    //         onClick={() => {
    //           const redoLast = redoStack[redoStack.length - 1];
    //           if (redoLast !== undefined) {
    //             setHistory((prev) => [...prev.slice(-49), prompt]);
    //             setPrompt(redoLast);
    //             setRedoStack((prev) => prev.slice(0, -1));
    //           }
    //         }}
    //       >
    //         <Redo2Icon className="mr-1 h-4 w-4" />
    //         Redo
    //       </Button>
    //     )}
    //   </div>
    // </form>
    <> </>
  );
}
