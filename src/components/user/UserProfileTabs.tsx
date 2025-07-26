import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Eye,
  Heart,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useFollowers,
  useFollowing,
  useUserSharedPrompts,
} from "@/lib/queries/user";

import { AppUser } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { SharedPrompt } from "@/types/sharedPrompt";
import { useParams } from "next/navigation";

interface UserProfileTabsProps {
  readonly isOwnProfile: boolean;
  readonly getRankColor: (rank: string) => string;
}

export function UserProfileTabs({
  isOwnProfile,
  getRankColor,
}: UserProfileTabsProps) {
  const { username } = useParams();

  const { data: followers, isLoading: isFollowersLoading } = useFollowers();
  const { data: following, isLoading: isFollowingLoading } = useFollowing();
  const { data: sharedPrompts = [], isLoading: isPromptsLoading } =
    useUserSharedPrompts(isOwnProfile ? undefined : (username as string));

  return (
    <Tabs defaultValue="prompts" className="w-full">
      <TabsList className="w-auto mr-auto grid grid-cols-3 overflow-x-auto">
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
      <TabsContent value="prompts" className="space-y-4">
        {sharedPrompts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No shared prompts yet
              </h3>
              <p className="text-muted-foreground text-sm">
                {isOwnProfile
                  ? "Start sharing your amazing prompts with the community!"
                  : "This user hasn't shared any prompts yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sharedPrompts.map((prompt: SharedPrompt) => (
              <Card
                key={prompt._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {prompt.content.length > 100
                          ? `${prompt.content.slice(0, 100)}...`
                          : prompt.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {prompt.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {prompt.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {prompt.shares}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {prompt.modelUsed}
                      </Badge>
                    </div>
                    <span>
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* followers tab*/}
      {(() => {
        let followersTabContent: React.ReactNode;
        if (isFollowersLoading) {
          followersTabContent = <Loader />;
        } else if (!followers || followers.length === 0) {
          followersTabContent = (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No followers yet</h3>
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
            <div className="grid gap-3">
              {followers.map((follower: AppUser) => (
                <Card key={follower._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={follower.avatar || "/placeholder.svg"}
                            alt={follower.fullname}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {follower.fullname
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{follower.fullname}</p>
                          <p className="text-sm text-muted-foreground">
                            @{follower.username}
                          </p>
                        </div>
                        <Badge
                          className={getRankColor(follower.rank || "Rookie")}
                        >
                          {follower.rank || "Rookie"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
            return <Loader />;
          }
          if ((following?.length ?? 0) === 0) {
            return (
              <Card>
                <CardContent className="p-8 text-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Not following anyone
                  </h3>
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
            <div className="grid gap-3">
              {(following ?? []).map((user: AppUser) => (
                <Card key={user._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.fullname}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.fullname}</p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                        <Badge className={getRankColor(user.rank || "Rookie")}>
                          {user.rank || "Rookie"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })()}
      </TabsContent>
    </Tabs>
  );
}
