"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SocialLink, SocialPlatform } from "@/types/user";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "../ui/loader";
import { PLATFORM_CONFIG } from "@/lib/constants/SOCIAL_PLATFORM";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUpdateUserProfile } from "@/lib/queries/user";

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly initialBio: string;
  readonly initialLinks: SocialLink[];
}

export function EditProfileModal({ open, onClose, initialBio, initialLinks }: Props) {
  const [bio, setBio] = useState(initialBio || "");
  const [usernames, setUsernames] = useState<Record<SocialPlatform, string>>({
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
  });

  const { mutate: updateProfile, isPending } = useUpdateUserProfile();

  useEffect(() => {
    setBio(initialBio || "");
    const map: Record<SocialPlatform, string> = {
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    };

    initialLinks.forEach((link) => {
      const platform = link.label;
      const base = PLATFORM_CONFIG[platform].baseUrl;
      if (link.url.startsWith(base)) {
        map[platform] = link.url.replace(base, "");
      }
    });

    setUsernames(map);
  }, [initialBio, initialLinks]);

  const handleSave = () => {
    const socials: SocialLink[] = (Object.keys(PLATFORM_CONFIG) as SocialPlatform[])
      .filter((platform) => usernames[platform]?.trim())
      .map((platform) => ({
        label: platform,
        url: `${PLATFORM_CONFIG[platform].baseUrl}${usernames[platform].trim()}`,
      }));

    const isValid = socials.every((s) => /^https?:\/\/.+/.test(s.url));
    if (!isValid) {
      toast.error("All usernames must result in valid URLs.");
      return;
    }

    updateProfile(
      { bio: bio.trim(), socials },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          onClose();
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={120}
              placeholder="Tell others about yourself, your expertise, and what kind of prompts you create..."
            />
            <p className="text-muted-foreground text-right text-xs">{bio.length}/120</p>
          </div>

          {/* Social Fields */}
          <div className="flex flex-col gap-6">
            {(Object.keys(PLATFORM_CONFIG) as SocialPlatform[]).map((platform) => {
              const { icon, placeholder, baseUrl } = PLATFORM_CONFIG[platform];
              return (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform} className="flex items-center gap-2 capitalize">
                    {icon}
                    {platform}
                    <span className="text-muted-foreground ml-auto text-xs lowercase">
                      {baseUrl}
                    </span>
                  </Label>
                  <Input
                    id={platform}
                    placeholder={placeholder}
                    value={usernames[platform]}
                    onChange={(e) => setUsernames({ ...usernames, [platform]: e.target.value })}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onClose} variant="outline" disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
