"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Calendar,
  Edit3,
  ExternalLink,
  Eye,
  Flame,
  Heart,
  Share2,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Mock data - In a real app, these would come from API calls
const mockSharedPrompts = [
  {
    id: "1",
    title: "Creative Writing Assistant",
    description: "Perfect for generating story ideas and character development",
    tags: ["Writing", "Creativity", "Storytelling"],
    likes: 234,
    views: 1520,
    model: "GPT-4",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Code Review Helper",
    description: "Comprehensive code analysis and improvement suggestions",
    tags: ["Development", "Code Review", "Programming"],
    likes: 189,
    views: 892,
    model: "Claude 3",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Marketing Copy Generator",
    description: "Create compelling marketing content for any product",
    tags: ["Marketing", "Copywriting", "Business"],
    likes: 156,
    views: 743,
    model: "Gemini Pro",
    createdAt: "2024-01-05",
  },
];

const mockFollowers = [
  {
    id: "1",
    username: "sarah_ai",
    fullname: "Sarah Chen",
    avatar: "/placeholder.svg",
    rank: "Veteran",
  },
  {
    id: "2",
    username: "mike_prompts",
    fullname: "Mike Rodriguez",
    avatar: "/placeholder.svg",
    rank: "Elite",
  },
  {
    id: "3",
    username: "emma_creative",
    fullname: "Emma Wilson",
    avatar: "/placeholder.svg",
    rank: "Cadet",
  },
];

const mockFollowing = [
  {
    id: "1",
    username: "ai_master",
    fullname: "David Kim",
    avatar: "/placeholder.svg",
    rank: "Master",
  },
  {
    id: "2",
    username: "prompt_guru",
    fullname: "Lisa Zhang",
    avatar: "/placeholder.svg",
    rank: "Veteran",
  },
];

// Define a type for the user data to be displayed
interface DisplayUser {
  _id: string;
  fullname: string;
  username: string;
  bio: string;
  avatar: string;
  plan: string;
  rank: string;
  streak: {
    current: number;
    best: number;
  };
  followerCount: number;
  followeeCount: number;
  createdAt: string;
}

interface UserProfileDisplayProps {
  user: DisplayUser; // The user data to display
  isOwnProfile: boolean; // True if this is the current user's profile
}

export function UserProfileDisplay({
  user,
  isOwnProfile,
}: UserProfileDisplayProps) {
  const [bio, setBio] = useState(user.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showBioAlert, setShowBioAlert] = useState(false);
  const [followStatus, setFollowStatus] = useState<{
    isFollowing: boolean;
    isFollowedBy: boolean;
  }>({
    isFollowing: false,
    isFollowedBy: false,
  });

  useEffect(() => {
    setBio(user.bio || ""); // Update bio state if user prop changes

    // Show bio alert if it's own profile and bio is empty
    if (isOwnProfile && (!user.bio || user.bio.trim() === "")) {
      setShowBioAlert(true);
    } else {
      setShowBioAlert(false); // Hide alert if bio exists or not own profile
    }

    // If not own profile, fetch follow status
    if (!isOwnProfile) {
      // TODO: Replace with actual API call to check follow status
      // This would check if current user follows this profile user
      // and if profile user follows current user back
      fetchFollowStatus();
    }
  }, [user, isOwnProfile]);

  const fetchFollowStatus = async () => {
    // Mock data for demonstration. In a real app, this would be an API call
    // to check if currentUser follows 'user' and if 'user' follows currentUser.
    // For example:
    // const response = await axiosInstance.get(`/api/users/${user._id}/follow-status`);
    // setFollowStatus(response.data);

    // Example mock: Assume the profile user (user.id) follows the current user (currentUser.id)
    // and the current user does NOT follow the profile user initially.
    setFollowStatus({
      isFollowing: false, // Current user does not follow this profile user
      isFollowedBy: true, // This profile user follows the current user
    });
  };

  const handleSaveBio = async () => {
    try {
      // TODO: API call to update bio
      // await updateUserBio(user._id, bio)
      setIsEditingBio(false);
      setShowBioAlert(false); // Hide alert after saving bio
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const newFollowingStatus = !followStatus.isFollowing;
      // TODO: API call to follow/unfollow
      // await toggleFollow(user._id, newFollowingStatus)

      setFollowStatus((prev) => ({
        ...prev,
        isFollowing: newFollowingStatus,
      }));
    } catch (error) {
      console.error("Failed to update follow status:", error);
    }
  };

  const getFollowButtonText = () => {
    if (followStatus.isFollowing) {
      return "Following";
    } else if (followStatus.isFollowedBy) {
      return "Follow Back";
    } else {
      return "Follow";
    }
  };

  const getFollowButtonVariant = () => {
    if (followStatus.isFollowing) {
      return "secondary";
    } else if (followStatus.isFollowedBy) {
      return "default"; // Primary style for "Follow Back"
    } else {
      return "default";
    }
  };

  const getRankColor = (rank: string) => {
    const colors = {
      Rookie: "bg-gray-100 text-gray-700",
      Cadet: "bg-blue-100 text-blue-700",
      Elite: "bg-purple-100 text-purple-700",
      Veteran: "bg-orange-100 text-orange-700",
      Master: "bg-yellow-100 text-yellow-700",
    };
    return colors[rank as keyof typeof colors] || colors.Rookie;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      Free: "bg-gray-100 text-gray-700",
      Premium: "bg-primary/10 text-primary",
      Enterprise:
        "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
    };
    return colors[plan as keyof typeof colors] || colors.Free;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Bio Alert for Own Profile */}
      {isOwnProfile && showBioAlert && (
        <Alert className="border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Complete your profile!</span> Add a
            bio to help others discover your expertise and interests.
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 ml-2 text-primary"
              onClick={() => setIsEditingBio(true)}
            >
              Add bio now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Header */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.fullname}
                />
                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                  {user.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.fullname}</h1>
                <p className="text-muted-foreground">@{user.username}</p>

                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge className={getPlanColor(user.plan)}>{user.plan}</Badge>
                  <Badge className={getRankColor(user.rank)}>
                    <Trophy className="h-3 w-3 mr-1" />
                    {user.rank}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bio & Stats */}
            <div className="flex-1 space-y-4">
              {/* Bio Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    About
                  </h3>
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingBio(true)}
                      className="h-6 px-2 text-xs"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      {bio.trim() ? "Edit" : "Add"}
                    </Button>
                  )}
                </div>

                {isEditingBio ? (
                  <div className="space-y-2">
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="text-sm resize-none"
                      rows={3}
                      maxLength={80}
                      placeholder="Tell others about yourself, your expertise, and what kind of prompts you create..."
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {bio.length}/80
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditingBio(false);
                            setBio(user.bio || ""); // Revert to original bio on cancel
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveBio}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {bio.trim() ? (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {bio}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/60 italic">
                        {isOwnProfile
                          ? "Add a bio to tell others about yourself"
                          : "No bio available"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="flex items-center flex-wrap gap-6 sm:gap-8 md:gap-10 pt-4">
                <div>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <Users className="h-4 w-4 text-primary" />
                    {user.followerCount?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <UserPlus className="h-4 w-4 text-primary" />
                    {user.followeeCount || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {user.streak?.current || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(user.createdAt).getFullYear()}
                  </div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
              </div>

              {/* Action Button */}
              {!isOwnProfile && (
                <div className="pt-4">
                  <Button
                    onClick={handleFollow}
                    variant={getFollowButtonVariant()}
                    className={
                      followStatus.isFollowing
                        ? "bg-muted text-muted-foreground hover:bg-muted/80"
                        : followStatus.isFollowedBy
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }
                  >
                    {getFollowButtonText()}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="prompts" className="w-full">
        <TabsList className="w-auto mr-auto grid grid-cols-3">
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

        {/* Shared Prompts */}
        <TabsContent value="prompts" className="space-y-4">
          {mockSharedPrompts.length === 0 ? (
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
              {mockSharedPrompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {prompt.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {prompt.description}
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
                          {prompt.views}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {prompt.model}
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

        {/* Followers */}
        <TabsContent value="followers" className="space-y-4">
          {mockFollowers.length === 0 ? (
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
          ) : (
            <div className="grid gap-3">
              {mockFollowers.map((follower) => (
                <Card key={follower.id}>
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
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{follower.fullname}</p>
                          <p className="text-sm text-muted-foreground">
                            @{follower.username}
                          </p>
                        </div>
                        <Badge className={getRankColor(follower.rank)}>
                          {follower.rank}
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
          )}
        </TabsContent>

        {/* Following */}
        <TabsContent value="following" className="space-y-4">
          {mockFollowing.length === 0 ? (
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
          ) : (
            <div className="grid gap-3">
              {mockFollowing.map((following) => (
                <Card key={following.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={following.avatar || "/placeholder.svg"}
                            alt={following.fullname}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {following.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{following.fullname}</p>
                          <p className="text-sm text-muted-foreground">
                            @{following.username}
                          </p>
                        </div>
                        <Badge className={getRankColor(following.rank)}>
                          {following.rank}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
