"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, ThumbsUp, Trash2 } from "lucide-react";
import { useDeleteComment, useToggleCommentLike } from "@/lib/queries/shared-prompt";

import { Button } from "../ui/button";
import { Comment } from "@/types/sharedPrompt";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

interface CommentItemProps {
  comment: Comment;
  promptId: string;
  onDelete: () => void;
}

export const CommentItem = ({ comment, promptId, onDelete }: CommentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [likeData, setLikeData] = useState({
    isUserLiked: comment.isUserLiked,
    likeCount: comment.likeCount,
  });

  const toggleLike = useToggleCommentLike(promptId, comment._id);
  const deleteComment = useDeleteComment(promptId, comment._id);

  const handleLike = () => {
    toggleLike.mutate(undefined, {
      onSuccess: (data) => {
        setLikeData({
          isUserLiked: data.isUserLiked,
          likeCount: data.likeCount,
        });
      },
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    deleteComment.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(data.message);
        onDelete();
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    });
  };

  return (
    <div className="bg-muted/40 border-muted space-y-3 rounded-md border px-4 py-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
          <AvatarFallback>{comment.author.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-muted-foreground text-sm font-medium">
            @{comment.author.username} {comment.isUserOwned ? "(You)" : ""}
          </p>
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {comment.isUserOwned && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive/80 ml-auto"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-foreground mt-1 text-sm">{comment.content}</p>
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={toggleLike.isPending}
          className={`flex items-center gap-2 transition-colors duration-200 ${
            likeData.isUserLiked
              ? "fill-muted-foreground text-blue-500 hover:text-blue-600"
              : "hover:text-blue-500"
          }`}
        >
          <ThumbsUp size={14} />
          <span>{likeData.likeCount}</span>
        </Button>
      </div>
    </div>
  );
};
