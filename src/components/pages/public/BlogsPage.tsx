"use client";

import { BookOpen, Filter, Search } from "lucide-react";

import { Article } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/public/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const categories = ["all", "guides", "tools", "advanced", "tips"];

export default function BlogsPage({ blogs }: { readonly blogs: Article[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = blogs.filter((article) => {
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="text-muted-foreground text-sm">
          Discover insights, tips, and guides for AI prompt engineering
        </p>
      </div>

      {/* Content */}
      {/* Search & category filters */}
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

      {/* Articles */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <BlogCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
