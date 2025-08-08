"use client";

import { useAddComment, useComments } from "@/lib/queries/shared-prompt";

import { Button } from "@/components/ui/button";
import { CommentItem } from "@/components/sharedPrompt/CommentItem";
import { CommentItemSkeleton } from "../skeletons/CommentItemSkeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

type CommentsSectionProps = {
  readonly promptId: string;
  readonly isSignedIn?: boolean;
  readonly openAuthModal?: () => void;
};

export function CommentsSection({
  promptId,
  isSignedIn = false,
  openAuthModal,
}: CommentsSectionProps) {
  const { data: comments = [], isLoading, refetch } = useComments(promptId);
  const addComment = useAddComment(promptId);

  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!isSignedIn) {
      if (openAuthModal) {
        openAuthModal();
      } else {
        toast.error("Please sign in to add a comment.");
      }
      return;
    }

    if (!comment.trim()) return;

    addComment.mutate(
      { content: comment },
      {
        onSuccess: () => {
          toast.success("Comment added!");
          setComment("");
        },
      },
    );
  };

  const userComment = comments.find((c) => c.isUserOwned);
  const otherComments = comments.filter((c) => !c.isUserOwned);

  return (
    <div className="w-full">
      <h1 className="mb-4 text-lg font-bold">All Comments ({comments.length})</h1>

      {/* Add Comment */}
      {!isLoading && !userComment && (
        <div className="mb-6">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleAddComment}
            disabled={addComment.isPending || !comment.trim()}
            className="mt-2 w-full sm:w-auto"
          >
            {addComment.isPending ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {(() => {
          if (isLoading) {
            return (
              <div className="space-y-4">
                <CommentItemSkeleton />
                <CommentItemSkeleton />
                <CommentItemSkeleton />
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
                  onDelete={refetch}
                />
              )}
              {otherComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  promptId={promptId}
                  onDelete={refetch}
                />
              ))}
            </>
          );
        })()}
      </div>
    </div>
  );
}
