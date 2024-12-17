export interface Profile {
  id: string;
  avatar: string;
  username: string;
  nickname: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export const PROFILES: Profile[] = [
  {
    id: "1",
    avatar: "/images/cafewithnotebook-logo.png",
    username: "cafe_with_notebook",
    nickname: "노트북하기 좋은 카페 | 노좋카",
    postCount: 6,
    followerCount: 6,
    followingCount: 6,
  },
];
export function profile(id: string) {
  return PROFILES.find((profile) => profile.id === id)!;
}

export const TEST_PROFILE = profile("1");
