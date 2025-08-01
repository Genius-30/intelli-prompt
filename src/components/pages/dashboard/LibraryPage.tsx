"use client";

import { BookmarkIcon, FileIcon, GitBranchIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Prompt } from "@/types/prompt";
import PromptCard from "@/components/prompt/PromptCard";
import { Version } from "@/types/version";
import { VersionCard } from "@/components/version/VersionCard";
import { useUserLibrary } from "@/lib/queries/user";

export default function LibraryPage() {
  const { data, isLoading, error } = useUserLibrary();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading library</p>;

  console.log("Library data:", data);

  const { favPrompts, favVersions, savedSharedPrompts } = data;

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
        <TabsList className="">
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
          {/* {savedSharedPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} isShared />
            ))} */}
        </TabsContent>

        {/* Favorite Prompts */}
        <TabsContent value="Favorite Prompts" className="space-y-4">
          {favPrompts.map((prompt: Prompt) => (
            <PromptCard key={prompt._id} {...prompt} />
          ))}
        </TabsContent>

        {/* Favorite Versions */}
        <TabsContent value="Favorite Versions" className="space-y-4">
          {favVersions.map((version: Version) => (
            <VersionCard key={version._id} version={version} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
