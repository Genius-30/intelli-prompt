import { Card, CardContent } from "@/components/ui/card";
import { Share2, UserPlus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFollowers, useFollowing, useUserSharedPrompts } from "@/lib/queries/user";

import { SharedPrompt } from "@/types/sharedPrompt";
import { SharedPromptCard } from "../sharedPrompt/SharedPromptCard";
import { SharedPromptCardSkeleton } from "../skeletons/SharedPromptCardUserSkeleton";
import { User } from "@/types/user";
import { UserCard } from "./UserCard";
import { UserCardSkeleton } from "../skeletons/UserCard";

interface UserProfileTabsProps {
  readonly user: User;
  readonly isOwnProfile: boolean;
}

export function UserProfileTabs({ user, isOwnProfile }: UserProfileTabsProps) {
  const { data: followers, isLoading: isFollowersLoading } = useFollowers(user?._id);

  const { data: following, isLoading: isFollowingLoading } = useFollowing(user?._id);
  const { data: sharedPrompts = [], isLoading: isPromptsLoading } = useUserSharedPrompts(user?._id);

  return (
    <Tabs defaultValue="prompts" className="w-full">
      <TabsList className="mr-auto grid h-10 w-auto grid-cols-3 overflow-x-auto">
        <TabsTrigger value="prompts" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Shared Prompts
        </TabsTrigger>
        <TabsTrigger value="followers" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Followers
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Following
        </TabsTrigger>
      </TabsList>

      {/* shared prompts tab */}
      {(() => {
        let promptsTabContent: React.ReactNode;
        if (isPromptsLoading) {
          promptsTabContent = (
            <div className="grid gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <SharedPromptCardSkeleton key={index} />
              ))}
            </div>
          );
        } else if (sharedPrompts.length === 0) {
          promptsTabContent = (
            <Card>
              <CardContent className="p-8 text-center">
                <Share2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">No shared prompts yet</h3>
                <p className="text-muted-foreground text-sm">
                  {isOwnProfile
                    ? "Start sharing your amazing prompts with the community!"
                    : "This user hasn't shared any prompts yet."}
                </p>
              </CardContent>
            </Card>
          );
        } else {
          promptsTabContent = (
            <div className="grid gap-4">
              {sharedPrompts.map((prompt: SharedPrompt) => (
                <SharedPromptCard key={prompt._id} prompt={prompt} showUser={false} />
              ))}
            </div>
          );
        }
        return (
          <TabsContent value="prompts" className="space-y-4">
            {promptsTabContent}
          </TabsContent>
        );
      })()}

      {/* followers tab*/}
      {(() => {
        let followersTabContent: React.ReactNode;
        if (isFollowersLoading) {
          followersTabContent = (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <UserCardSkeleton key={index} />
              ))}
            </div>
          );
        } else if (!followers || followers.length === 0) {
          followersTabContent = (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">No followers yet</h3>
                <p className="text-muted-foreground text-sm">
                  {isOwnProfile
                    ? "Share great prompts to attract followers!"
                    : "This user doesn't have any followers yet."}
                </p>
              </CardContent>
            </Card>
          );
        } else {
          followersTabContent = (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {followers.map((user: User) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          );
        }
        return (
          <TabsContent value="followers" className="space-y-4">
            {followersTabContent}
          </TabsContent>
        );
      })()}

      {/* following tab */}
      <TabsContent value="following" className="space-y-4">
        {(() => {
          if (isFollowingLoading) {
            return (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <UserCardSkeleton key={index} />
                ))}
              </div>
            );
          }
          if ((following?.length ?? 0) === 0) {
            return (
              <Card>
                <CardContent className="p-8 text-center">
                  <UserPlus className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-medium">Not following anyone</h3>
                  <p className="text-muted-foreground text-sm">
                    {isOwnProfile
                      ? "Discover and follow other prompt creators!"
                      : "This user isn't following anyone yet."}
                  </p>
                </CardContent>
              </Card>
            );
          }
          return (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {(following ?? []).map((user: User) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          );
        })()}
      </TabsContent>
    </Tabs>
  );
}
