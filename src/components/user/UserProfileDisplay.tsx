"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Calendar,
  Edit3,
  Flame,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  useFollowStatus,
  useToggleFollow,
  useUpdateUserBio,
} from "@/lib/queries/user";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "../ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { UserProfileTabs } from "./UserProfileTabs";
import { toast } from "sonner";

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
  readonly user: DisplayUser;
  readonly isOwnProfile: boolean;
}

export function UserProfileDisplay({
  user,
  isOwnProfile,
}: UserProfileDisplayProps) {
  const [bio, setBio] = useState(user.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showBioAlert, setShowBioAlert] = useState(false);

  const { data: followStatus, isLoading: isFollowLoading } = useFollowStatus(
    isOwnProfile ? undefined : user._id
  );
  const { mutate: updateUserBio, isPending: isBioUpdating } =
    useUpdateUserBio();
  const { mutate: toggleFollow, isPending: isFollowMutating } =
    useToggleFollow();

  useEffect(() => {
    setBio(user.bio || "");

    // Show bio alert if it's own profile and bio is empty
    if (isOwnProfile && (!user.bio || user.bio.trim() === "")) {
      setShowBioAlert(true);
    } else {
      setShowBioAlert(false);
    }
  }, [user, isOwnProfile]);

  const handleSaveBio = () => {
    updateUserBio(
      { bio },
      {
        onSuccess: () => {
          setIsEditingBio(false);
          setShowBioAlert(false);
        },
        onError: (err) => {
          console.error("Bio update failed", err);
          toast.error("Failed to update bio. Please try again.");
        },
      }
    );
  };

  const handleFollow = () => {
    if (!user._id || isFollowMutating || isFollowLoading) return;

    toggleFollow(
      {
        userId: user._id,
        isFollowing: followStatus?.isFollowing || false,
      },
      {
        onSuccess: () => {
          toast.success(
            followStatus?.isFollowing ? "Unfollowed user" : "Followed user"
          );
        },
        onError: () => {
          toast.error("Failed to update follow status. Try again.");
        },
      }
    );
  };

  const getFollowButtonVariant = () => {
    if (followStatus?.isFollowing) {
      return "secondary";
    } else if (followStatus?.isFollowedBy) {
      return "default";
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
    <div className="space-y-6">
      {/* Bio Alert for Own Profile */}
      {isOwnProfile && showBioAlert && (
        <Alert className="w-full flex items-center border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="w-full flex items-center justify-around text-sm">
            <div className="flex flex-col items-start">
              <span className="font-medium">Complete your profile!</span>
              <span>
                Add a bio to help others discover your expertise and interests.
              </span>
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary ml-auto"
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
          <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                <AvatarImage src={user.avatar || ""} alt={user.fullname} />
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
                <div className="flex items-center justify-between">
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
                            setBio(user.bio || "");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveBio}
                          disabled={isBioUpdating}
                        >
                          {isBioUpdating ? (
                            <>
                              <Loader />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
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
              {!isOwnProfile &&
                (() => {
                  let followButtonLabel = "Follow";
                  if (isFollowLoading || isFollowMutating) {
                    followButtonLabel = "Loading...";
                  } else if (followStatus?.isFollowing) {
                    followButtonLabel = "Following";
                  } else if (followStatus?.isFollowedBy) {
                    followButtonLabel = "Follow Back";
                  }

                  let followButtonClassName = "";
                  if (followStatus?.isFollowing) {
                    followButtonClassName =
                      "bg-muted text-muted-foreground hover:bg-muted/80";
                  } else if (followStatus?.isFollowedBy) {
                    followButtonClassName =
                      "bg-primary text-primary-foreground hover:bg-primary/90";
                  }

                  return (
                    <div className="pt-4">
                      <Button
                        onClick={handleFollow}
                        variant={getFollowButtonVariant()}
                        disabled={isFollowLoading || isFollowMutating}
                        className={followButtonClassName}
                      >
                        {followButtonLabel}
                      </Button>
                    </div>
                  );
                })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <UserProfileTabs
        isOwnProfile={isOwnProfile}
        getRankColor={getRankColor}
      />
    </div>
  );
}
