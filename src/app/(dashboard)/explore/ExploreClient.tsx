"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bookmark,
  Clock,
  Filter,
  Heart,
  MessageCircle,
  Search,
  Share,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function ExploreClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState("All");

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
      timeAgo: "2h ago",
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
      timeAgo: "4h ago",
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
      timeAgo: "6h ago",
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
      timeAgo: "8h ago",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Explore Community
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover and share amazing AI prompts
          </p>
        </div>
        <Button className="cursor-pointer">
          <Share className="h-4 w-4" />
          Share Prompt
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm py-0">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts, tags, or authors..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Categories Filter */}
            <div className="flex items-center flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(category.name)}
                  className={`py-0 px-2 text-xs whitespace-nowrap border sm:border-2 text-muted-foreground cursor-pointer transition-all ${
                    selected === category.name
                      ? "!border-primary text-primary bg-primary/10 hover:bg-primary/20"
                      : ""
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div>
        <Tabs defaultValue="trending" className="space-y-4 gap-0">
          <TabsList className="grid grid-cols-3 self-end mb-2 data-[state=active]:border-primary">
            <TabsTrigger
              value="trending"
              className="flex items-center gap-1.5 text-sm"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="flex items-center gap-1.5 text-sm"
            >
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="top"
              className="flex items-center gap-1.5 text-sm"
            >
              <Star className="h-4 w-4" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-3">
            {trendingPrompts.map((prompt) => (
              <Card key={prompt.id} className="p-4">
                <CardHeader className="flex items-center justify-between p-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={prompt.author.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {prompt.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-medium">
                          {prompt.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          @{prompt.author.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {prompt.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {prompt.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  {/* Content */}
                  <div className="space-y-1">
                    <Link href={`/prompts/${prompt.id}`}>
                      <h3 className="text-base font-semibold hover:text-primary cursor-pointer line-clamp-1">
                        {prompt.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {prompt.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 hover:bg-secondary/80 cursor-pointer"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs hover:bg-red-50 hover:text-red-600"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {prompt.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs hover:bg-blue-50 hover:text-blue-600"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {prompt.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        {prompt.saves}
                      </Button>
                    </div>
                    <Link href={`/prompts/${prompt.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Recent prompts will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="top" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Top rated prompts will be displayed here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
