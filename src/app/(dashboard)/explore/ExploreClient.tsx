"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Clock,
  Star,
  Filter,
  Share,
} from "lucide-react";
import Link from "next/link";

export default function ExploreClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingPrompts = [
    {
      id: 1,
      title: "Advanced Code Review Assistant",
      description:
        "Comprehensive code review with security, performance, and best practices analysis",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "sarahc",
      },
      tags: ["development", "code-review", "security"],
      likes: 234,
      comments: 45,
      saves: 89,
      timeAgo: "2 hours ago",
      category: "Development",
    },
    {
      id: 2,
      title: "Email Marketing Campaign Generator",
      description:
        "Create compelling email campaigns with subject lines, content, and CTAs",
      author: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "mikej",
      },
      tags: ["marketing", "email", "copywriting"],
      likes: 189,
      comments: 32,
      saves: 67,
      timeAgo: "4 hours ago",
      category: "Marketing",
    },
    {
      id: 3,
      title: "Research Paper Summarizer",
      description:
        "Extract key insights and create concise summaries from academic papers",
      author: {
        name: "Dr. Emily Watson",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "emilyw",
      },
      tags: ["research", "academic", "summarization"],
      likes: 156,
      comments: 28,
      saves: 94,
      timeAgo: "6 hours ago",
      category: "Research",
    },
    {
      id: 4,
      title: "Creative Writing Companion",
      description:
        "Generate story ideas, character development, and plot suggestions",
      author: {
        name: "Alex Rivera",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "alexr",
      },
      tags: ["creative", "writing", "storytelling"],
      likes: 298,
      comments: 67,
      saves: 123,
      timeAgo: "8 hours ago",
      category: "Creative",
    },
  ];

  const categories = [
    { name: "All", count: 1247 },
    { name: "Development", count: 423 },
    { name: "Marketing", count: 298 },
    { name: "Research", count: 187 },
    { name: "Creative", count: 156 },
    { name: "Business", count: 183 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Explore Community</h1>
          <p className="text-muted-foreground">
            Discover and share amazing AI prompts
          </p>
        </div>
        <Button>
          <Share className="mr-2 h-4 w-4" />
          Share Prompt
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts, tags, or authors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="trending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Top Rated
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-4">
              {trendingPrompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>
                              {prompt.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {prompt.author.name}
                              </span>
                              <span className="text-muted-foreground">
                                @{prompt.author.username}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {prompt.timeAgo}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline">{prompt.category}</Badge>
                      </div>

                      {/* Content */}
                      <div>
                        <Link href={`/prompts/${prompt.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                            {prompt.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground mt-1">
                          {prompt.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{prompt.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{prompt.comments}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Bookmark className="h-4 w-4" />
                            <span>{prompt.saves}</span>
                          </Button>
                        </div>
                        <Link href={`/prompts/${prompt.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                Recent prompts will be displayed here
              </div>
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                Top rated prompts will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
