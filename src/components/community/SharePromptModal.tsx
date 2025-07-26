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
import { PROMPT_TAGS } from "@/lib/constants/PROMPT_TAGS";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/queries/user";
import { useRouter } from "next/navigation";
import { useSharePrompt } from "@/lib/queries/community";
import { useState } from "react";

interface SharePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptContent: string;
  versionId: string;
}

export function SharePromptModal({
  isOpen,
  onClose,
  promptContent,
}: SharePromptModalProps) {
  const [title, setTitle] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { data: currentUser } = useCurrentUser();
  const { mutate: sharePrompt, isPending: isSharing } = useSharePrompt();

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
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleShare = async () => {
    if (!title.trim() || selectedTags.length === 0 || !selectedModel) return;

    sharePrompt(
      {
        title: title.trim(),
        content: promptContent,
        tags: selectedTags,
        modelUsed: selectedModel,
      },
      {
        onSuccess: (data) => {
          const sharedPromptId = data?._id;

          toast.success("Prompt shared successfully!", {
            action: {
              label: "View Prompt",
              onClick: () => {
                router.push(`/shared-prompts/${sharedPromptId}`);
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
        onError: () => {
          onClose();
        },
      }
    );
  };

  const isFormValid = title.trim() && selectedTags.length > 0 && selectedModel;

  const availableModels = Object.values(AI_MODELS).flatMap((provider) =>
    provider.models.map((model) => ({
      id: model.id,
      name: model.name,
      provider: provider.name,
    }))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90%] sm:max-w-[70%] md:max-w-[55%] h-[90vh] overflow-hidden p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Share with Community
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Help others discover your amazing prompt
              </DialogDescription>
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-primary/40" />
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          {/* User Card */}
          {currentUser && (
            <Card className="bg-muted/10 p-0 rounded-lg">
              <CardContent className="py-2 px-4 flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.username}
                  />
                  <AvatarFallback>
                    {currentUser.username?.charAt(0).toUpperCase() || "YOU"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {currentUser.username || "YOU"}
                  </p>
                  <p className="text-xs text-muted-foreground">Publishing as</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-primary" />
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
                <Zap className="h-4 w-4 text-primary" />
                Best Performing Model{" "}
                <span className="text-destructive">*</span>
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
                <FileText className="h-4 w-4 text-primary" /> Prompt Preview
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
                  <Tag className="h-4 w-4 text-primary" />
                  Select Tags <span className="text-destructive">*</span>
                </Label>
                <div className="text-xs text-muted-foreground">
                  {selectedTags.length}/{MAX_TAGS} selected
                </div>
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="p-3 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Selected Tags:
                  </p>
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
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Categories */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-0">
                {PROMPT_TAGS.map((category) => (
                  <div
                    key={category.category}
                    className="border-b last:border-b-0"
                  >
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm">
                        {category.category}
                      </span>
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
                            const isDisabled =
                              !isSelected && selectedTags.length >= MAX_TAGS;

                            return (
                              <button
                                key={tag}
                                onClick={() => handleSelectTag(tag)}
                                disabled={isDisabled}
                                className={`px-2 py-1 rounded-md text-xs border transition-all ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : isDisabled
                                    ? "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed opacity-50"
                                    : "bg-background hover:bg-muted border-border hover:border-primary/50"
                                }`}
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
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                  Maximum {MAX_TAGS} tags selected. Remove a tag to add another.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4 bg-background">
          <span className="text-xs text-muted-foreground">
            {isFormValid ? (
              <span className="text-green-600 flex items-center gap-1">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" /> Ready
                to share
              </span>
            ) : (
              "Please fill all required fields"
            )}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSharing}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={!isFormValid || isSharing}
              className="gap-2"
            >
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
