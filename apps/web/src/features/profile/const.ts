import { POSTS } from "../post-detail/const";

export const TEST_PROFILE = {
  avatar: "/images/cafewithnotebook-logo.png",
  username: "cafe_with_notebook",
  nickname: "노트북하기 좋은 카페 | 노좋카",
  postCount: POSTS.length,
  followerCount: 6,
  followingCount: 6,
} as const;
export type Profile = typeof TEST_PROFILE;
