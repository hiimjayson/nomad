import { Profile } from "@/features/profile/const";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { OmitPropsOf } from "@/types/util";
import { ArrowRightLongIcon } from "@/icons/arrow-right-long";

type Props = Pick<Profile, "avatar" | "nickname" | "username"> &
  OmitPropsOf<typeof Link, "href">;

export function Bio({
  avatar,
  nickname,
  username,
  className,
  ...props
}: Props) {
  return (
    <Link
      href={`/${username}`}
      className={cn("flex items-center gap-2 md:gap-3", className)}
      {...props}
    >
      <Avatar src={avatar} className="size-10" />
      <div className="flex flex-col">
        <p className="text-typo-secondary text-sm md:text-base font-semibold text-ellipsis">
          {nickname}
        </p>
        <p className="text-typo-secondary text-opacity-55 text-sm md:text-base font-medium text-ellipsis">
          @{username}
        </p>
      </div>
      <ArrowRightLongIcon className="h-6 ml-auto text-typo-time text-opacity-35" />
    </Link>
  );
}
