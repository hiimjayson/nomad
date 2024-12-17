import { Avatar } from "@/components/atoms/Avatar";
import { Profile } from "../const";

export function ProfileHeader({
  avatar,
  nickname,
  username,
  postCount,
}: Pick<Profile, "avatar" | "nickname" | "username" | "postCount">) {
  return (
    <div className="flex w-full justify-between px-5">
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
}
