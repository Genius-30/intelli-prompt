"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Grid3X3, Search, Share, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SharedPromptCard } from "@/components/community/SharedPromptCard";
import { SharedPromptCardSkeleton } from "@/components/skeletons/SharedPromptCardSkeleton";
import { useRouter } from "next/navigation";

// Mock hook to simulate API call
function useSharedPrompts() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData([
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
        },
        {
          id: 2,
          title: "Email Marketing Campaign Generator",
          description: "Create compelling email campaigns with subject lines, content, and CTAs",
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
        },
        {
          id: 3,
          title: "Research Paper Summarizer",
          description: "Extract key insights and create concise summaries from academic papers",
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
        },
        {
          id: 4,
          title: "Creative Writing Companion",
          description: "Generate story ideas, character development, and plot suggestions",
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
        },
        {
          id: 5,
          title: "Data Analysis Helper",
          description: "Analyze datasets and generate insights with statistical summaries",
          author: {
            name: "John Smith",
            avatar: "/placeholder.svg?height=32&width=32",
            username: "johns",
          },
          tags: ["data", "analysis", "statistics"],
          likes: 167,
          comments: 23,
          saves: 78,
          timeAgo: "10h ago",
        },
        {
          id: 6,
          title: "Social Media Content Creator",
          description: "Generate engaging posts, captions, and hashtags for social platforms",
          author: {
            name: "Lisa Park",
            avatar: "/placeholder.svg?height=32&width=32",
            username: "lisap",
          },
          tags: ["social-media", "content", "engagement"],
          likes: 201,
          comments: 38,
          saves: 92,
          timeAgo: "12h ago",
        },
      ]);
      setIsLoading(false);
    }, 1500); // Simulate 1.5s loading time

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}

export default function ExploreClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: prompts, isLoading } = useSharedPrompts();

  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Filter prompts based on search query
  const filteredPrompts = prompts.filter(
    (prompt) =>
      searchQuery === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Get trending prompts (top 4 by likes for demo)
  const trendingPrompts = [...prompts].sort((a, b) => b.likes - a.likes).slice(0, 4);

  const filteredTrendingPrompts = trendingPrompts.filter(
    (prompt) =>
      searchQuery === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleSharePrompt = () => {
    if (isSignedIn) {
      openSignIn({ redirectUrl: window.location.href });
      return;
    }
    router.push("/folders");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Explore Community</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Discover and share amazing AI prompts with the community
          </p>
        </div>
        <Button variant="secondary" className="gap-2" onClick={handleSharePrompt}>
          <Share className="h-4 w-4" />
          Share Prompt
        </Button>
      </div>

      {/* Search and Tabs Row */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search prompts, tags, or authors..."
            className="border-primary/20 focus:border-primary/40 h-10 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-auto">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="all" className="flex items-center gap-2 px-4">
              <Grid3X3 className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 px-4">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsContent value="all" className="space-y-4">
          {(() => {
            if (isLoading) {
              // Loading skeleton
              return (
                <div className="grid gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SharedPromptCardSkeleton key={index} />
                  ))}
                </div>
              );
            } else if (filteredPrompts.length === 0) {
              // Empty state
              return (
                <Card className="border-primary/20 border-2 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    {searchQuery ? (
                      <>
                        <Search className="text-muted-foreground/40 mb-4 h-16 w-16" />
                        <h3 className="text-foreground mb-2 text-xl font-semibold">
                          No prompts found
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          We couldn't find any prompts matching "{searchQuery}". Try adjusting your
                          search terms or browse all prompts.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 bg-transparent"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <FileText className="text-muted-foreground/40 mb-4 h-16 w-16" />
                        <h3 className="text-foreground mb-2 text-xl font-semibold">
                          No shared prompts yet
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          Be the first to share your amazing prompts with the community! Start by
                          creating and sharing your first prompt.
                        </p>
                        <Link href="/folders">
                          <Button className="mt-4 gap-2">
                            <Share className="h-4 w-4" />
                            Share Your First Prompt
                          </Button>
                        </Link>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            } else {
              // Prompts list
              return (
                <div className="grid gap-4">
                  {filteredPrompts.map((prompt) => (
                    <SharedPromptCard key={`all-${prompt.id}`} prompt={prompt} />
                  ))}
                </div>
              );
            }
          })()}
        </TabsContent>

        {/* Extracted trending empty state */}
        <TabsContent value="trending" className="space-y-4">
          {(() => {
            if (isLoading) {
              // Loading skeleton
              return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SharedPromptCardSkeleton key={index} />
                  ))}
                </div>
              );
            }

            if (filteredTrendingPrompts.length === 0) {
              // Empty state
              return (
                <Card className="border-primary/20 border-2 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    {searchQuery ? (
                      <>
                        <Search className="text-muted-foreground/40 mb-4 h-16 w-16" />
                        <h3 className="text-foreground mb-2 text-xl font-semibold">
                          No trending prompts found
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          We couldn't find any trending prompts matching "{searchQuery}". Try
                          adjusting your search terms.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 bg-transparent"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="text-muted-foreground/40 mb-4 h-16 w-16" />
                        <h3 className="text-foreground mb-2 text-xl font-semibold">
                          No trending prompts yet
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          Trending prompts will appear here based on community engagement. Be the
                          first to create viral content!
                        </p>
                        <Link href="/folders">
                          <Button className="mt-4 gap-2">
                            <Share className="h-4 w-4" />
                            Share Your First Prompt
                          </Button>
                        </Link>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            }

            // Trending prompts list
            return (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredTrendingPrompts.map((prompt) => (
                  <SharedPromptCard
                    key={`trending-${prompt.id}`}
                    prompt={prompt}
                    showTrendingIndicator={true}
                  />
                ))}
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
