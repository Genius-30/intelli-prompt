"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Loader2, Share, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "../ui/loader";
import { TagMultiSelect } from "../common/TagMultiSelect";
import { Textarea } from "@/components/ui/textarea";
import { flattenPromptTags } from "@/utils/flattenPromptTags";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/queries/user";
import { useGetAllResponsesForVersion } from "@/lib/queries/response";
import { useSharePrompt } from "@/lib/queries/community";
import { useUpdateSharedPrompt } from "@/lib/queries/shared-prompt";

interface SharePromptModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly promptContent: string;
  readonly versionId: string;
  readonly isEdit?: boolean;
  readonly sharedPromptId?: string;
  readonly initialData?: {
    readonly title: string;
    readonly tags: string[];
    readonly responseId: string;
  };
}

export function SharePromptModal({
  isOpen,
  onClose,
  promptContent,
  versionId,
  isEdit = false,
  sharedPromptId,
  initialData,
}: SharePromptModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { mutate: sharePrompt, isPending: isSharing } = useSharePrompt();
  const { mutate: updatePrompt, isPending: isUpdating } = useUpdateSharedPrompt();
  const { data: responses = [], isLoading: isLoadingResponses } =
    useGetAllResponsesForVersion(versionId);

  useEffect(() => {
    if (isEdit && initialData?.responseId && responses.length > 0) {
      const matchingResponse = responses.find((r) => r._id === initialData.responseId);
      if (matchingResponse) {
        setSelectedResponseId(matchingResponse._id);
      }
    }
  }, [isEdit, initialData, responses]);

  const handleCreateShare = async () => {
    if (!title.trim() || selectedTags.length === 0 || !selectedResponseId) return;

    sharePrompt(
      {
        title: title.trim(),
        content: promptContent,
        versionId,
        tags: selectedTags,
        responseId: selectedResponseId,
      },
      {
        onSuccess: (data) => {
          toast.success("Prompt shared successfully!", {
            action: {
              label: "View Prompt",
              onClick: () => {
                window.location.href = `/prompt/${data.newSharedPromptId}`;
              },
            },
            duration: 5000,
          });

          setTitle("");
          setSelectedTags([]);
          setSelectedResponseId(null);
          onClose();
        },
      },
    );
  };

  const handleUpdateShare = async () => {
    if (
      !title.trim() ||
      selectedTags.length === 0 ||
      (versionId && !selectedResponseId) ||
      !sharedPromptId
    )
      return;

    updatePrompt(
      {
        _id: sharedPromptId,
        newTitle: title.trim(),
        tags: selectedTags,
        responseId: selectedResponseId || "",
      },
      {
        onSuccess: () => {
          toast.success("Prompt updated successfully!");
          onClose();
        },
      },
    );
  };

  const isFormValid = title.trim() && selectedTags.length > 0 && isEdit && selectedResponseId;

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
                <FileText className="text-primary h-4 w-4" /> Prompt Preview
              </Label>
              <Textarea
                value={promptContent}
                readOnly
                className="min-h-[120px] resize-none text-sm"
              />
            </div>

            {/* Tags Selection */}
            <div className="space-y-2">
              <TagMultiSelect
                tags={flattenPromptTags()}
                selected={selectedTags}
                setSelected={setSelectedTags}
                maxSelected={5}
              />

              {selectedTags.length > 0 && (
                <div className="bg-muted/30 border-muted-foreground/20 flex items-center gap-4 rounded-lg border-2 border-dashed p-3">
                  <p className="text-muted-foreground text-sm font-medium">Selected Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
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
                    const isSelected = selectedResponseId === resp._id;
                    return (
                      <button
                        key={resp._id}
                        onClick={() => setSelectedResponseId(resp._id)}
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
            <Button variant="outline" onClick={onClose} disabled={isSharing || isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={isEdit ? handleUpdateShare : handleCreateShare}
              disabled={!isFormValid || isSharing || isUpdating}
              className="gap-2"
            >
              {(isEdit ? isUpdating : isSharing) ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />{" "}
                  {isEdit ? "Updating..." : "Sharing..."}
                </>
              ) : (
                <>
                  <Share className="h-3 w-3" /> {isEdit ? "Update Prompt" : "Share Prompt"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
