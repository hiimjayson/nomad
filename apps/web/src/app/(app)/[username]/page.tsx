import { Spacing } from "@/components/atoms/Spacing";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfilePosts } from "@/features/profile/components/ProfilePosts";
import { ProfileToolbar } from "@/features/profile/components/ProfileToolbar";
import { TEST_PROFILE } from "@/features/profile/const";
import { pick } from "es-toolkit";
import React from "react";

export default function ProfilePage() {
  const profile = TEST_PROFILE;

  return (
    <>
      <div className="flex flex-col items-center py-16">
        <ProfileHeader
          {...pick(profile, ["avatar", "nickname", "username", "postCount"])}
        />
        <Spacing size={16} />
        <ProfileToolbar />
        <Spacing size={16} />
        <ProfilePosts />
      </div>
    </>
  );
}
