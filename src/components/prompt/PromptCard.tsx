import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  GitBranchIcon,
  PlusIcon,
  SquarePenIcon,
  Star,
  StarOff,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useToggleFavorite } from "@/lib/queries/folder";

type PromptCardProps = {
  prompt: {
    _id: string;
    title: string;
    isFavorite: boolean;
    totalVersions: number;
    updatedAt: string;
    activeVersion: string;
  };
};

export function PromptCard({
  prompt,
}: {
  readonly prompt: Readonly<PromptCardProps["prompt"]>;
}) {
  const router = useRouter();
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const handleCardClick = () => {
    router.push(`/prompts/${prompt._id}/versions`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(prompt._id);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="hover:shadow-md transition cursor-pointer"
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <h3 className="text-lg font-semibold truncate">{prompt.title}</h3>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "hover:text-yellow-500",
            prompt.isFavorite && "text-yellow-500"
          )}
          onClick={handleToggleFavorite}
          disabled={isPending}
        >
          {prompt.isFavorite ? (
            <Star className="w-4 h-4 fill-yellow-400" />
          ) : (
            <StarOff className="w-4 h-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranchIcon className="w-4 h-4" />
          <span>
            {prompt.totalVersions} version{prompt.totalVersions > 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 text-xs">
        <span className="text-muted-foreground">
          Updated {formatDistanceToNow(new Date(prompt.updatedAt))} ago
        </span>

        {prompt.activeVersion ? (
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="px-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/prompts/${prompt._id}/versions/${prompt.activeVersion}`}
              >
                <SquarePenIcon className="w-4 h-4 mr-1" /> Edit
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="default"
              className="px-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/prompts/${prompt._id}/versions/${prompt.activeVersion}/test`}
              >
                <Zap className="w-4 h-4" /> Test Prompt
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            asChild
            size="sm"
            className="text-xs"
            variant="secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/prompts/${prompt._id}/versions/new`}>
              <PlusIcon className="w-4 h-4" /> Create Version
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
