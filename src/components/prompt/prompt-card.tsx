import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { SquarePenIcon, TestTube2Icon } from "lucide-react";

export function PromptCard({
  prompt,
}: {
  prompt: {
    _id: string;
    title: string;
    prompt: string;
    updatedAt: string;
  };
}) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <h3 className="text-lg font-semibold truncate">{prompt.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {prompt.prompt}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 text-xs">
        <span className="text-muted-foreground">
          Updated {formatDistanceToNow(new Date(prompt.updatedAt))} ago
        </span>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="px-3">
            <Link href={`/dashboard/prompts/${prompt._id}`}>
              <SquarePenIcon /> Edit
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="default"
            className="bg-green-500 hover:bg-green-600 px-3"
          >
            <Link href={`/dashboard/prompts/test/${prompt._id}`}>
              <TestTube2Icon /> Test
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
