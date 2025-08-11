"use client";

import { BookOpen, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

import type { Article } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/public/BlogCard";
import { BlogCardSkeleton } from "@/components/skeletons/BlogCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data - replace with actual API call
const mockArticles: Article[] = [
  {
    _id: "1",
    title: "Getting Started with AI Prompt Engineering",
    excerpt:
      "Learn the fundamentals of crafting effective AI prompts that deliver consistent, high-quality results for your projects.",
    category: "guides",
    author: "Sarah Chen",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    image: "/placeholder.svg?height=200&width=400",
    slug: "getting-started-ai-prompt-engineering",
    content: "<div>Content here...</div>",
  },
  {
    _id: "2",
    title: "How to Organize AI Prompts Like a Pro: Your 2025 Guide",
    excerpt:
      "Master prompt management in 2025 with our guide to organizing prompts, versioning, folders, and metadata.",
    category: "tools",
    author: "Genius Porwal",
    date: "July 31, 2025",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=400",
    slug: "organize-ai-prompts-2025",
    content: "<div>Content here...</div>",
  },
  {
    _id: "3",
    title: "Advanced Techniques for ChatGPT Prompt Optimization",
    excerpt:
      "Discover advanced strategies to optimize your ChatGPT prompts for better accuracy, creativity, and consistency.",
    category: "advanced",
    author: "Mike Johnson",
    date: "Dec 10, 2024",
    readTime: "12 min read",
    image: "/placeholder.svg?height=200&width=400",
    slug: "chatgpt-prompt-optimization",
    content: "<div>Content here...</div>",
  },
];

const categories = ["all", "guides", "tools", "advanced", "tips"];

export default function BlogsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock API call
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setArticles(mockArticles);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="text-muted-foreground text-sm">
          Discover insights, tips, and guides for AI prompt engineering
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search articles..."
            className="h-9 pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-2 py-1 text-xs"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {(() => {
        if (loading) {
          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          );
        } else if (filteredArticles.length > 0) {
          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <BlogCard key={article._id} article={article} />
              ))}
            </div>
          );
        } else {
          return (
            <div className="py-12 text-center">
              <BookOpen className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
              {searchQuery || selectedCategory !== "all" ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No articles found</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button variant="outline" onClick={clearSearch}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No articles yet</h3>
                  <p className="text-muted-foreground text-sm">Check back soon for new content!</p>
                </div>
              )}
            </div>
          );
        }
      })()}
    </div>
  );
}
