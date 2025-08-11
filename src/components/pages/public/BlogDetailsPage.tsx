"use client";

import { ArrowLeft, Bookmark, Clock, Heart, Share2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

import type { Article } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogDetailPageProps {
  readonly slug: string;
}

// Mock article data - replace with actual API call
const mockArticle: Article = {
  _id: "2",
  title: "Ask Smarter Than the Top 1%: 5 AI Prompting Habits That Actually Work",
  excerpt:
    "Want to get better answers from AI tools like IntelliPrompt? Learn 5 elite-level prompting habits that help you think clearer, debug faster, and build smarter.",
  category: "prompting",
  author: "Mohd Zaid",
  date: "August 7, 2025",
  readTime: "6 min read",
  image: "/images/article2.jpeg",
  slug: "ask-better-questions-with-ai",
  content: `<div class="article-content">

  <h1 class="text-3xl font-bold mb-6">Ask Smarter Than the Top 1%: 5 AI Prompting Habits That Actually Work</h1>

  <p class="mb-4">In a world where AI tools like IntelliPrompt are becoming your second brain, <strong>asking better questions</strong> isn't just a skill—it’s your productivity multiplier. Whether you're debugging, learning, or designing, your prompt is your blueprint. So how do the top 1% ask better—and how can you ask even better than them?</p>

  <p class="mb-4">Here are 5 elite-level strategies that will instantly improve the way you interact with AI.</p>

  <h2 class="text-2xl font-bold mt-8 mb-4">1. 🎯 Start With the Goal, Not the Term</h2>
  <p class="mb-4"><strong>Common mistake:</strong> Asking “What is X?” without explaining what you're trying to achieve.</p>
  <p class="mb-4"><strong>Better:</strong> “I want my Next.js app to load faster on poor networks. Would edge caching help here?”</p>
  <p class="mb-4">Goal-driven prompts lead to focused, actionable responses. You’re not just curious—you’re building.</p>

  <h2 class="text-2xl font-bold mt-8 mb-4">2. 🛠 Frame It Like a GitHub Issue</h2>
  <p class="mb-4"><strong>Common mistake:</strong> Vague questions like “My API isn’t working.”</p>
  <p class="mb-4"><strong>Better:</strong> “In my Next.js route using OpenRouter, I get a 401 only with Gemini. Auth headers seem fine—what could I be missing?”</p>
  <p class="mb-4">The more precise your setup, the more precise the fix. Treat prompts like bug reports.</p>

  <h2 class="text-2xl font-bold mt-8 mb-4">3. 🧭 Ask for Direction, Not Just Answers</h2>
  <p class="mb-4"><strong>Common mistake:</strong> “Give me a system design for my app.”</p>
  <p class="mb-4"><strong>Better:</strong> “Here’s the current architecture for IntelliPrompt. What would a FAANG engineer suggest to scale this to 1M users?”</p>
  <p class="mb-4">Good questions get answers. Great ones spark ideas and better questions.</p>

  <h2 class="text-2xl font-bold mt-8 mb-4">4. ⚙️ Mention Your Stack or Tools Up Front</h2>
  <p class="mb-4"><strong>Common mistake:</strong> Leaving out your tech stack and asking generic queries.</p>
  <p class="mb-4"><strong>Better:</strong> “How do I queue and send verification emails in Next.js 14 using Resend and Redis?”</p>
  <p class="mb-4">One line of context can save you 10 irrelevant responses.</p>

  <h2 class="text-2xl font-bold mt-8 mb-4">5. 🔁 Recap to Lock It In</h2>
  <p class="mb-4"><strong>Pro move:</strong> Paraphrase what you learned to validate your understanding.</p>
  <p class="mb-4"><strong>Example:</strong> “So if I’m understanding correctly, I need to switch to a \`.js\` worker because ESM modules don’t run inside \`.ts\` workers in native Node.js?”</p>
  <p class="mb-4">This confirms you got it right—and shows where you might’ve missed something.</p>

  <h2 class="text-2xl font-bold mt-8 mb-4">🧠 Bonus: The “Smart Prompt” Template</h2>
  <p class="mb-4">Here’s a high-impact format you can start using right away in IntelliPrompt:</p>

  <pre class="bg-muted px-4 py-2 rounded mb-4 text-sm overflow-auto"><code>
I'm building [project] using [tools]. I’m trying to [goal], but hitting [problem].

Here’s what I’ve tried: [your effort]

Can you help me understand [specific ask] or guide me on [what to explore]?
  </code></pre>

  <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion: Ask Like a Builder</h2>
  <p class="mb-4">The smartest users don’t ask perfect questions—they ask <strong>evolving questions</strong> that unlock deeper learning and better results.</p>
  <p class="mb-4">Start using these habits inside IntelliPrompt and watch your thinking compound—<a href="#" class="text-indigo-600 underline">start prompting smarter now</a>.</p>

  </div>`,
};

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      // In real app, fetch by slug
      setArticle(mockArticle);
      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back button skeleton */}
        <Skeleton className="h-9 w-24" />

        {/* Header skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Image skeleton */}
        <Skeleton className="aspect-video w-full rounded-lg" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
        </div>
      </div>
    );
  }

  if (!article) {
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
          <Badge variant="secondary">{article.category}</Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>

        <div className="flex flex-wrap items-center justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
            <span>{article.date}</span>
          </div>

          <div className="mt-1 flex items-center space-x-2 sm:mt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-600 hover:text-red-700" : ""}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? "text-yellow-600 hover:text-yellow-700" : ""}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={article.image || "/placeholder.png"}
          alt={article.title}
          width={800}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* Article Actions */}
      <div className="flex items-center justify-center space-x-4 border-t py-6">
        <Button
          variant="outline"
          onClick={() => setIsLiked(!isLiked)}
          className={isLiked ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          {isLiked ? "Liked" : "Like"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={isBookmarked ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50" : ""}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          {isBookmarked ? "Saved" : "Save"}
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
