"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Share,
  Share2,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "../ui/loader";
import { PROMPT_TAGS } from "@/lib/constants/PROMPT_TAGS";
import { Response } from "@/types/sharedPrompt";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/queries/user";
import { useGetAllResponsesForVersion } from "@/lib/queries/response";
import { useRouter } from "next/navigation";
import { useSharePrompt } from "@/lib/queries/community";
import { useState } from "react";

interface SharePromptModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly promptContent: string;
  readonly versionId: string;
}

export function SharePromptModal({
  isOpen,
  onClose,
  promptContent,
  versionId,
}: SharePromptModalProps) {
  const [title, setTitle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { mutate: sharePrompt, isPending: isSharing } = useSharePrompt();
  const { data: responses = [], isLoading: isLoadingResponses } =
    useGetAllResponsesForVersion(versionId);

  const router = useRouter();

  const MAX_TAGS = 5;

  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < MAX_TAGS) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const handleShare = async () => {
    if (!title.trim() || selectedTags.length === 0 || !selectedModel || !selectedResponse) return;

    sharePrompt(
      {
        title: title.trim(),
        content: promptContent,
        tags: selectedTags,
        modelUsed: selectedModel,
        responseId: selectedResponse._id,
      },
      {
        onSuccess: (data) => {
          toast.success("Prompt shared successfully!", {
            action: {
              label: "View Prompt",
              onClick: () => {
                router.push(`/profile`);
              },
            },
            duration: 5000,
          });

          setTitle("");
          setSelectedTags([]);
          setSelectedModel("");
          setExpandedCategories([]);
          onClose();
        },
      },
    );
  };

  const isFormValid = title.trim() && selectedTags.length > 0 && selectedModel;

  const availableModels = Object.values(AI_MODELS).flatMap((provider) =>
    provider.models.map((model) => ({
      id: model.id,
      name: model.name,
      provider: provider.name,
    })),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90vh] w-full max-w-[90%] gap-0 overflow-hidden p-0 sm:max-w-[70%] md:max-w-[55%]">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-2 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Share2 className="text-primary h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Share with Community</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Help others discover your amazing prompt
              </DialogDescription>
            </div>
          </div>
          <Sparkles className="text-primary/40 h-4 w-4" />
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="space-y-6 overflow-y-auto px-6 py-6">
          {/* User Card */}
          {currentUser && (
            <Card className="bg-muted/10 rounded-lg p-0">
              <CardContent className="flex items-center gap-3 px-4 py-2">
                <Avatar className="ring-primary/20 h-8 w-8 ring-2">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                  <AvatarFallback>
                    {currentUser.username?.charAt(0).toUpperCase() || "YOU"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{currentUser.username || "YOU"}</p>
                  <p className="text-muted-foreground text-xs">Publishing as</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <FileText className="text-primary h-4 w-4" />
                Prompt Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your prompt a catchy title..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Zap className="text-primary h-4 w-4" />
                Best Performing Model <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select model..." />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}{" "}
                      <Badge variant="outline" className="ml-2">
                        {model.provider}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <FileText className="text-primary h-4 w-4" /> Prompt Preview
              </Label>
              <Textarea
                value={promptContent}
                readOnly
                className="min-h-[120px] resize-none text-sm"
              />
            </div>

            {/* Tags Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Tag className="text-primary h-4 w-4" />
                  Select Tags <span className="text-destructive">*</span>
                </Label>
                <div className="text-muted-foreground text-xs">
                  {selectedTags.length}/{MAX_TAGS} selected
                </div>
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="bg-muted/30 border-muted-foreground/20 rounded-lg border-2 border-dashed p-3">
                  <p className="text-muted-foreground mb-2 text-sm font-medium">Selected Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive ml-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Categories */}
              <div className="rounded-lg border p-0">
                {PROMPT_TAGS.map((category) => (
                  <div
                    key={category.category}
                    className={`border-b last:border-b-0 ${expandedCategories.includes(category.category) ? "mb-2" : "mb-0"}`}
                  >
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="hover:bg-muted/50 flex w-full items-center justify-between p-3 transition-colors"
                    >
                      <span className="text-sm font-medium">{category.category}</span>
                      {expandedCategories.includes(category.category) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedCategories.includes(category.category) && (
                      <div className="px-3 pb-3">
                        <div className="flex flex-wrap gap-2">
                          {category.tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            const isDisabled = !isSelected && selectedTags.length >= MAX_TAGS;

                            const tagButtonClass = isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : isDisabled
                                ? "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed opacity-50"
                                : "bg-background hover:bg-muted border-border hover:border-primary/50";

                            return (
                              <button
                                key={tag}
                                onClick={() => handleSelectTag(tag)}
                                disabled={isDisabled}
                                className={`rounded-md border px-2 py-1 text-xs transition-all ${tagButtonClass}`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedTags.length >= MAX_TAGS && (
                <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                  Maximum {MAX_TAGS} tags selected. Remove a tag to add another.
                </p>
              )}
            </div>
          </div>

          {/* Response Selection Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Sparkles className="text-primary h-4 w-4" />
              Choose a Response to Showcase <span className="text-destructive">*</span>
            </Label>

            {(() => {
              if (isLoadingResponses) {
                return (
                  <div className="text-muted-foreground flex items-center text-sm">
                    <Loader /> Loading responses...
                  </div>
                );
              }
              if (responses.length === 0) {
                return (
                  <div className="text-muted-foreground text-sm italic">
                    No Responses! You have to generate atleast one response to share a prompt.
                  </div>
                );
              }
              return (
                <div className="grid gap-3">
                  {responses.map((resp) => {
                    // Ensure resp is of type Response
                    const isSelected = selectedResponse?._id === resp._id;
                    return (
                      <button
                        key={resp._id}
                        onClick={() =>
                          setSelectedResponse({
                            _id: resp._id,
                            model: resp.model,
                            temperature: resp.temperature,
                            createdAt: resp.createdAt,
                            responseId: resp._id,
                          })
                        }
                        className={`rounded-lg border p-4 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/30 border-border"
                        }`}
                      >
                        <div className="text-muted-foreground mb-1 flex justify-between text-xs">
                          <span className="capitalize">{resp.model}</span>
                          <span>Temp: {resp.temperature}</span>
                          <span>{new Date(resp.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-foreground line-clamp-3 text-sm">
                          {resp._id ? (resp as any).response : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background flex items-center justify-between border-t px-6 py-4">
          <span className="text-muted-foreground text-xs">
            {isFormValid ? (
              <span className="flex items-center gap-1 text-green-600">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Ready to share
              </span>
            ) : (
              "Please fill all required fields"
            )}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSharing}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={!isFormValid || isSharing} className="gap-2">
              {isSharing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Sharing...
                </>
              ) : (
                <>
                  <Share className="h-3 w-3" /> Share Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
