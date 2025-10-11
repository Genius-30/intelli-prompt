"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Grid3X3, Search, Share, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useOverallSharedPrompts, useTrendingSharedPrompts } from "@/lib/queries/community";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SharedPrompt } from "@/types/sharedPrompt";
import { SharedPromptCard } from "@/components/sharedPrompt/SharedPromptCard";
import { SharedPromptCardSkeleton } from "@/components/skeletons/SharedPromptCardSkeleton";
import { useOpenAuthModal } from "@/hooks/useOpenAuthModal";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ExploreClient() {
  const openAuthModal = useOpenAuthModal();

  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"all" | "trending">("all");

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: overallDataResponse, isLoading: isLoadingOverall } = useOverallSharedPrompts({
    page,
    limit,
    search: searchQuery,
    enabled: tab === "all",
  });

  const { data: trendingData, isLoading: isLoadingTrending } = useTrendingSharedPrompts({
    enabled: tab === "trending",
  });

  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleSharePrompt = () => {
    if (!isSignedIn) {
      openAuthModal();
      return;
    }
    router.push("/folders");
  };

  const overallPrompts = overallDataResponse?.data || [];
  const hasMoreOverall = overallDataResponse?.pagination?.hasMore;

  return (
    <div className="space-y-6 container lg:max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-1">
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
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search prompts, tags, or authors..."
            className="border-primary/20 focus:border-primary/40 text-md h-10 pl-10 sm:text-lg"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (tab !== "all") setTab("all");
            }}
          />
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(val) => {
            setTab(val as "all" | "trending");
            setSearchQuery("");
            setPage(1);
          }}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 sm:h-10">
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
            if (isLoadingOverall) {
              return (
                <div className="grid gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SharedPromptCardSkeleton key={index} />
                  ))}
                </div>
              );
            } else if (overallPrompts.length === 0) {
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
              return (
                <>
                  <div className="grid gap-4">
                    {overallPrompts.map((prompt: SharedPrompt) => (
                      <SharedPromptCard key={prompt._id} prompt={prompt} />
                    ))}
                  </div>
                  {hasMoreOverall && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isLoadingOverall}
                      >
                        {isLoadingOverall ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </>
              );
            }
          })()}
        </TabsContent>

        {/* Extracted trending empty state */}
        <TabsContent value="trending" className="space-y-4">
          {(() => {
            if (isLoadingTrending) {
              // Loading skeleton
              return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SharedPromptCardSkeleton key={index} />
                  ))}
                </div>
              );
            }

            if (trendingData && trendingData.length === 0) {
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
                {trendingData?.map((prompt) => (
                  <SharedPromptCard key={`trending-${prompt._id}`} prompt={prompt} />
                ))}
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
