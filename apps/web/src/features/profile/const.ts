export const TEST_PROFILE = {
  avatar: "/images/profile.jpg",
  username: "nomad_workspace",
  nickname: "노마드워커",
  postCount: 6,
  followerCount: 6,
  followingCount: 6,
} as const;
export type Profile = typeof TEST_PROFILE;
