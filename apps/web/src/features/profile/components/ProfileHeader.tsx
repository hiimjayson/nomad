"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { IconButton } from "@/components/atoms/IconButton";
import { Profile } from "../const";
import { Share2 } from "lucide-react";
import { share } from "@/lib/share";

export function ProfileHeader({
  avatar,
  nickname,
  username,
  postCount,
}: Pick<Profile, "avatar" | "nickname" | "username" | "postCount">) {
  return (
    <div className="flex flex-col w-full px-5">
      <Avatar src={avatar} className="mb-4" />
      <div className="flex w-full items-center justify-between ">
        <div>
          <h2 className="text-gray-700 text-xl font-bold">{nickname}</h2>
          <p className="text-gray-400">@{username}</p>
        </div>
        <IconButton
          onClick={async () => {
            try {
              await share({
                title: nickname,
                url: window.location.href.split("?")[0],
              });
            } catch (error) {
              console.error("공유에 실패했습니다.", error);
            }
          }}
        >
          <Share2 className="text-typo-time text-opacity-40" />
        </IconButton>
      </div>
      <p className="text-typo-secondary mt-6">
        <span className="font-semibold text-xl">{postCount}</span> visits
      </p>
    </div>
  );
}
