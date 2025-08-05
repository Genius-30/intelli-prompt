"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Edit3, Flame, Globe, UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SocialPlatform, User } from "@/types/user";
import { getFollowButtonVariant, getPlanColor, getRankColor, socialColors } from "@/lib/ui-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "./EditProfileModal";
import Link from "next/link";
import { UserProfileTabs } from "./UserProfileTabs";
import { socialIcons } from "@/lib/constants/SOCIAL_PLATFORM";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useToggleFollow } from "@/lib/queries/user";

interface UserProfileDisplayProps {
  readonly user: User;
  readonly isOwnProfile: boolean;
  readonly followStatus?: { isFollowing: boolean; isFollowedBy: boolean };
}

const getIcon = (label: string) => {
  const key = label.toLowerCase();
  return socialIcons[key] || <Globe className="h-4 w-4" />;
};

export function UserProfileDisplay({ user, isOwnProfile, followStatus }: UserProfileDisplayProps) {
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const { isSignedIn } = useAuth();

  const { mutate: toggleFollow, isPending: isFollowMutating } = useToggleFollow();

  const handleFollow = () => {
    if (!isSignedIn) {
      toast.info("You must be signed in to follow users.");
      return;
    }

    if (!user._id || isFollowMutating) return;

    toggleFollow(
      {
        userId: user._id,
        isFollowing: followStatus?.isFollowing || false,
        username: user.username,
      },
      {
        onSuccess: () => {
          toast.success(
            followStatus?.isFollowing ? `Unfollowed ${user.username}` : `Followed ${user.username}`,
          );
        },
        onError: () => {
          toast.error("Failed to update follow status. Try again.");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Bio & Socials Alert for Own Profile */}
      {isOwnProfile && (!user.bio?.trim() || (user.socials || []).length === 0) && (
        <Alert className="border-primary/20 bg-primary/5 flex w-full items-center">
          <AlertCircle className="text-primary h-4 w-4" />
          <AlertDescription className="flex w-full items-center justify-around text-sm">
            <div className="flex flex-col items-start">
              <span className="font-medium">Complete your profile!</span>
              {(() => {
                let alertMessage = "";
                if (!user.bio?.trim() && (user.socials || []).length === 0) {
                  alertMessage = "Add a bio and social links to help others connect with you.";
                } else if (!user.bio?.trim()) {
                  alertMessage = "Add a bio to showcase your interests and expertise.";
                } else {
                  alertMessage = "Add social links so people can connect with you outside the app.";
                }
                return <span>{alertMessage}</span>;
              })()}
            </div>
            <Button
              variant="link"
              size="sm"
              className="text-primary ml-auto h-auto p-0"
              onClick={() => setEditProfileOpen(true)}
            >
              Complete now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Header */}
      <Card className="px-4">
        <CardContent className="px-6">
          <div className="flex flex-col gap-4 sm:gap-12 md:flex-row">
            {/* Avatar & Basic Info */}
            <div className="flex h-full flex-col items-center md:items-start">
              <Avatar className="ring-primary/20 h-24 w-24 ring-4">
                <AvatarImage src={user.avatar || ""} alt={user.fullname} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {user.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 text-center md:text-start">
                <h1 className="text-2xl font-bold">{user.fullname}</h1>
                <p className="text-muted-foreground">@{user.username}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {isOwnProfile && <Badge className={getPlanColor(user.plan)}>{user.plan}</Badge>}
                </div>
              </div>
            </div>

            {/* Bio, Stats and Social links */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* User Bio */}
                  {user.bio?.trim() && (
                    <div className="text-muted-foreground/70 text-sm whitespace-pre-line">
                      About: <span className="text-muted-foreground font-medium">{user.bio}</span>
                    </div>
                  )}

                  {/* Social Links */}
                  {user.socials && user.socials.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3">
                      {user.socials.map((social, idx) => (
                        <Link
                          key={idx}
                          href={social.url}
                          title={`${social.label}: ${social.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-transform hover:scale-[1.02]"
                        >
                          <Badge className="bg-muted/70 gap-1 px-2 py-1.5 text-xs font-medium transition-all">
                            {getIcon(social.label)}
                            <span className="text-foreground capitalize">{social.label}</span>
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {/* Edit Profile Button */}
                {isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditProfileOpen(true)}
                    className="h-6 px-2 text-xs"
                  >
                    <Edit3 className="mr-1 h-3 w-3" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Stats Grid */}
              <div className="flex flex-wrap items-center gap-6 pt-4 sm:gap-8 md:gap-10">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="text-primary h-4 w-4" />
                    {user.followerCount?.toLocaleString() || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">Followers</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <UserPlus className="text-primary h-4 w-4" />
                    {user.followeeCount || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">Following</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {user.streak?.current || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">Day Streak</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Calendar className="text-primary h-4 w-4" />
                    {new Date(user.createdAt).getFullYear()}
                  </div>
                  <p className="text-muted-foreground text-xs">Joined</p>
                </div>
              </div>

              {/* Action Button */}
              {!isOwnProfile &&
                (() => {
                  let followButtonLabel = "Follow";
                  if (followStatus?.isFollowing) {
                    followButtonLabel = "Following";
                  } else if (followStatus?.isFollowedBy) {
                    followButtonLabel = "Follow Back";
                  }

                  let followButtonClassName = "";
                  if (followStatus?.isFollowing) {
                    followButtonClassName = "bg-muted text-muted-foreground hover:bg-muted/80";
                  } else if (followStatus?.isFollowedBy) {
                    followButtonClassName =
                      "bg-primary text-primary-foreground hover:bg-primary/90";
                  }

                  return (
                    <div className="pt-4">
                      <Button
                        onClick={handleFollow}
                        variant={getFollowButtonVariant(followStatus)}
                        disabled={isFollowMutating}
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
      <UserProfileTabs user={user} isOwnProfile={isOwnProfile} />

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        initialBio={user.bio ?? ""}
        initialLinks={(user.socials || []).map((social) => ({
          ...social,
          label: social.label as SocialPlatform,
        }))}
      />
    </div>
  );
}
