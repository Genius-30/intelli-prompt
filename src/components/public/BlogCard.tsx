import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

import type { Article } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  readonly article: Article;
}

export function BlogCard({ article }: BlogCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md">
      <Link href={`/blog/${article.slug}`}>
        <CardHeader className="px-4">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={article.image || "/placeholder.png"}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-muted-foreground px-2 py-1 text-xs backdrop-blur-sm"
              >
                {article.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          <div className="space-y-2">
            <h3 className="group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
              {article.title}
            </h3>
            <p className="text-muted-foreground line-clamp-3 text-sm">{article.excerpt}</p>
          </div>

          <div className="border-border/50 flex items-center justify-between border-t pt-2">
            <div className="text-muted-foreground flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.readTime}</span>
              </div>
            </div>
            <span className="text-muted-foreground text-xs">{article.date}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
