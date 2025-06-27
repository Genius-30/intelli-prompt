import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
      <CardFooter className="flex justify-between text-xs">
        <span className="text-muted-foreground">
          Updated {formatDistanceToNow(new Date(prompt.updatedAt))} ago
        </span>
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/prompts/${prompt._id}`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
