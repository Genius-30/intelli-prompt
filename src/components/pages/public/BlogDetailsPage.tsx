"use client";

import { ArrowLeft, Clock, Share2, User } from "lucide-react";

import { Article } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetailPage({ blog }: { readonly blog: Article | undefined }) {
  if (!blog) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <h1 className="mb-2 text-2xl font-bold">Article not found</h1>
        <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button */}
      <Link href="/blog">
        <Button variant="ghost" className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      {/* Article Header */}
      <div className="mt-2 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{blog.category}</Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{blog.title}</h1>

        <div className="flex flex-wrap items-center justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </div>
            <span>{blog.date}</span>
          </div>

          <div className="mt-1 flex items-center space-x-2 sm:mt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.share({ title: blog.title, url: window.location.href })}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={blog.image || "/placeholder.png"}
          alt={blog.title}
          width={800}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Article Actions */}
      <div className="flex items-center justify-center space-x-4 border-t py-6">
        <Button
          variant="outline"
          onClick={() => navigator.share({ title: blog.title, url: window.location.href })}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
