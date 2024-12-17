import { Avatar } from "@/components/atoms/Avatar";
import { pick } from "es-toolkit";
import React from "react";

const PROFILE = {
  avatar: "/images/profile.jpg",
  username: "nomad_workspace",
  nickname: "노마드워커",
  postCount: 6,
  followerCount: 6,
  followingCount: 6,
} as const;
type Profile = typeof PROFILE;

export default function ProfilePage() {
  const profile = PROFILE;

  return (
    <>
      <div className="flex flex-col items-center py-16">
        <ProfilePage.Header
          {...pick(profile, ["avatar", "nickname", "username", "postCount"])}
        />
        <div className="w-full">
          <div className="grid grid-cols-3 gap-1">
            {/* 각 게시물은 이곳에 추가 */}
            <div className="bg-gray-800 h-40"></div>
            <div className="bg-gray-800 h-40"></div>
            <div className="bg-gray-800 h-40"></div>
            {/* 추가 게시물 */}
          </div>
        </div>
      </div>
    </>
  );
}

ProfilePage.Header = function Header({
  avatar,
  nickname,
  username,
  postCount,
}: Pick<Profile, "avatar" | "nickname" | "username" | "postCount">) {
  return (
    <div className="flex w-full justify-between mb-5 px-5">
      <div className="flex flex-col">
        <Avatar src={avatar} className="mb-4" />
        <h2 className="text-gray-700 text-xl font-bold">{nickname}</h2>
        <p className="text-gray-400">@{username}</p>

        <p className="text-typo-secondary mt-6">
          <span className="font-semibold text-xl">{postCount}</span> visits
        </p>
      </div>
    </div>
  );
};
