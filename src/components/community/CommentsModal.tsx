"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddComment, useComments } from "@/lib/queries/shared-prompt";

import { Button } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";
import { ExternalLinkIcon } from "lucide-react";
import { Loader } from "../ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CommentModalProps = {
  readonly promptId: string;
  readonly open: boolean;
  readonly onOpenChange: (val: boolean) => void;
  readonly setCommentData: React.Dispatch<
    React.SetStateAction<{
      isCommented: boolean;
      commentCount: number;
    }>
  >;
};

export function CommentsDialog({
  promptId,
  open,
  onOpenChange,
  setCommentData,
}: CommentModalProps) {
  const { data: comments = [], isLoading } = useComments(promptId);
  const addComment = useAddComment(promptId);

  const router = useRouter();

  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!comment.trim()) return;

    addComment.mutate(
      { content: comment },
      {
        onSuccess: () => {
          toast.success("Comment added!");
          setComment("");
          setCommentData((prev) => ({
            isCommented: true,
            commentCount: (prev.commentCount || 0) + 1,
          }));
        },
        onError: () => toast.error("Failed to add comment"),
      },
    );
  };

  const userComment = comments.find((c) => c.isUserOwned);
  const otherComments = comments.filter((c) => !c.isUserOwned);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl overflow-y-auto">
        <DialogHeader className="h-auto">
          <DialogTitle className="text-lg font-semibold">Comments ({comments.length})</DialogTitle>
        </DialogHeader>

        {/* Comment List */}
        <div className="mt-3 flex flex-col space-y-3">
          {(() => {
            if (isLoading) {
              return (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader /> Loading comments...
                </div>
              );
            }
            if (comments.length === 0) {
              return <p className="text-muted-foreground text-sm">No comments yet.</p>;
            }
            return (
              <>
                {userComment && (
                  <CommentItem
                    key={userComment._id}
                    comment={userComment}
                    promptId={promptId}
                    onDelete={() =>
                      setCommentData((prev) => ({
                        isCommented: false,
                        commentCount: Math.max(0, prev.commentCount - 1),
                      }))
                    }
                  />
                )}
                {otherComments.map((c) => (
                  <CommentItem
                    key={c._id}
                    comment={c}
                    promptId={promptId}
                    onDelete={() =>
                      setCommentData((prev) => ({
                        isCommented: prev.isCommented,
                        commentCount: Math.max(0, prev.commentCount - 1),
                      }))
                    }
                  />
                ))}
              </>
            );
          })()}
        </div>

        {/* Comment Input */}
        {!isLoading && !userComment && (
          <div className="mt-4 space-y-2">
            <Textarea
              placeholder="Add your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleAddComment} className="w-full">
              Add Comment
            </Button>
          </div>
        )}

        {/* View More Button */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => router.push(`/prompt/${promptId}`)}>
            View Full Discussion <ExternalLinkIcon className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
