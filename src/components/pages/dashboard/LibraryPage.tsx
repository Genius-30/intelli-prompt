"use client";

import { BookmarkIcon, FileIcon, GitBranchIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Prompt } from "@/types/prompt";
import PromptCard from "@/components/prompt/PromptCard";
import PromptCardSkeleton from "@/components/skeletons/PromptCardSkeleton";
import { SharedPrompt } from "@/types/sharedPrompt";
import { SharedPromptCard } from "@/components/sharedPrompt/SharedPromptCard";
import { SharedPromptCardSkeleton } from "@/components/skeletons/SharedPromptCardSkeleton";
import { Version } from "@/types/version";
import { VersionCard } from "@/components/version/VersionCard";
import { VersionsSkeleton } from "@/components/skeletons/VersionsSkeleton";
import { useUserLibrary } from "@/lib/queries/user";

export default function LibraryPage() {
  const { data, isLoading } = useUserLibrary();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">My Library</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your saved and favorite prompts and versions here.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="saved prompts" className="w-auto">
        <TabsList className="h-10">
          <TabsTrigger value="saved prompts" className="flex items-center gap-2 px-4">
            <BookmarkIcon className="h-4 w-4" />
            Saved Prompts
          </TabsTrigger>
          <TabsTrigger value="Favorite Prompts" className="flex items-center gap-2 px-4">
            <FileIcon className="h-4 w-4" />
            Favorite Prompts
          </TabsTrigger>
          <TabsTrigger value="Favorite Versions" className="flex items-center gap-2 px-4">
            <GitBranchIcon className="h-4 w-4" />
            Favorite Versions
          </TabsTrigger>
        </TabsList>

        {/* Saved Shared Prompts */}
        <TabsContent value="saved prompts" className="space-y-4">
          {(() => {
            if (isLoading) {
              return new Array(3)
                .fill(0)
                .map((_, index) => <SharedPromptCardSkeleton key={index} />);
            }
            if (data?.savedSharedPrompts?.length) {
              return data.savedSharedPrompts.map((prompt: SharedPrompt) => (
                <SharedPromptCard key={prompt._id} prompt={prompt} />
              ));
            }
            return (
              <p className="text-muted-foreground mt-4 ml-1 text-sm">No saved prompts found.</p>
            );
          })()}
        </TabsContent>

        {/* Favorite Prompts */}
        <TabsContent value="Favorite Prompts" className="space-y-4">
          {(() => {
            if (isLoading) {
              return new Array(3).fill(0).map((_, index) => <PromptCardSkeleton key={index} />);
            }
            if (data?.favPrompts?.length) {
              return data.favPrompts.map((prompt: Prompt) => (
                <PromptCard key={prompt._id} {...prompt} />
              ));
            }
            return (
              <p className="text-muted-foreground mt-4 ml-1 text-sm">No favorite prompts found.</p>
            );
          })()}
        </TabsContent>

        {/* Favorite Versions */}
        <TabsContent value="Favorite Versions" className="space-y-4">
          {(() => {
            if (isLoading) {
              return new Array(3)
                .fill(0)
                .map((_, index) => <VersionsSkeleton key={index} showDot={false} />);
            }
            if (data?.favVersions?.length) {
              return data.favVersions.map((version: Version) => (
                <VersionCard key={version._id} version={version} />
              ));
            }
            return (
              <p className="text-muted-foreground mt-4 ml-1 text-sm">No favorite versions found.</p>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
