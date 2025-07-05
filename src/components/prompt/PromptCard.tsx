import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  SquarePenIcon,
  TestTube2Icon,
  Star,
  StarOff,
  GitBranchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type PromptCardProps = {
  prompt: {
    _id: string;
    title: string;
    isFavorite: boolean;
    totalVersions: number;
    updatedAt: string;
    activeVersion: {
      _id: string;
    };
  };
};

export function PromptCard({ prompt }: { prompt: PromptCardProps["prompt"] }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/prompts/${prompt._id}/versions`);
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
          onClick={(e) => {
            e.stopPropagation(); // prevent card navigation
            // toggle favorite logic here
          }}
        >
          {prompt.isFavorite ? (
            <Star className="w-4 h-4" />
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

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="px-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/prompts/${prompt._id}/versions/${prompt.activeVersion._id}`}
            >
              <SquarePenIcon className="w-4 h-4 mr-1" /> Edit
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="default"
            className="bg-green-500 hover:bg-green-600 px-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/prompts/${prompt._id}/versions/${prompt.activeVersion._id}/test`}
            >
              <TestTube2Icon className="w-4 h-4 mr-1" /> Test
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
