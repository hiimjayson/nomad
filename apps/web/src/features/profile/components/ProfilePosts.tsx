"use client";

import { cn } from "@/lib/cn";
import {
  ProfileViewType,
  useProfileViewType,
} from "../hooks/useProfileViewType";
import { PostCard } from "@/components/molecules/PostCard";
import { SwitchCase } from "@toss/react";
import { POSTS } from "@/features/post-detail/const";

export function ProfilePosts() {
  const [view] = useProfileViewType();

  const posts = POSTS;

  return (
    <div
      className={cn(
        "w-full grid grid-cols-2 gap-x-2 gap-y-3 p-2",
        view === ProfileViewType.List && "flex flex-col"
      )}
    >
      {posts.length === 0 ? (
        <ProfilePosts.Empty />
      ) : (
        [...posts].reverse().map((post) => (
          <SwitchCase
            key={post.id}
            value={view}
            caseBy={{
              [ProfileViewType.Grid]: <PostCard.Grid {...post} />,
              [ProfileViewType.List]: <PostCard.List {...post} />,
            }}
          />
        ))
      )}
    </div>
  );
}

ProfilePosts.Empty = function Empty() {
  const [view] = useProfileViewType();
  return (
    <SwitchCase
      value={view}
      caseBy={{
        [ProfileViewType.Grid]: (
          <>
            <PostCard.GridFrame>No</PostCard.GridFrame>
            <PostCard.GridFrame>visits</PostCard.GridFrame>
            <PostCard.GridFrame>here</PostCard.GridFrame>
            <PostCard.GridFrame>🥲</PostCard.GridFrame>
          </>
        ),
        [ProfileViewType.List]: (
          <>
            <PostCard.ListFrame>No</PostCard.ListFrame>
            <PostCard.ListFrame>visits</PostCard.ListFrame>
            <PostCard.ListFrame>here</PostCard.ListFrame>
            <PostCard.ListFrame>🥲</PostCard.ListFrame>
          </>
        ),
      }}
    />
  );
};
