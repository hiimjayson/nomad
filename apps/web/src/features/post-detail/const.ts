import { profile } from "../profile/const";
import { getAlldaySchedules, Post, Space } from "./types";

export const SPACES: Space[] = [
  {
    id: "1",
    name: "어라운드",
    latitude: 1,
    longitude: 1,
    schedules: getAlldaySchedules("09:00", "23:00"),
    address: "서울특별시 마포구 연남동 223-68번지 지하층",
    addressElements: [
      {
        type: "SIDO",
        longName: "서울특별시",
        shortName: "서울",
        code: "11",
      },
      {
        type: "SIGUGUN",
        longName: "마포구",
        shortName: "마포",
        code: "11680",
      },
      {
        type: "DONGMYUN",
        longName: "연남동",
        shortName: "연남동",
        code: "1168010100",
      },
      {
        type: "RI",
        longName: "223-68번지",
        shortName: "223-68번지",
        code: "11680101001000000000",
      },
      {
        type: "ROAD_NAME",
        longName: "연남로",
        shortName: "연남로",
        code: "11680101001000000000",
      },
      {
        type: "BUILDING_NUMBER",
        longName: "223-68번지",
        shortName: "223-68번지",
        code: "11680101001000000000",
      },
      {
        type: "LAND_NUMBER",
        longName: "223-68번지",
        shortName: "223-68번지",
        code: "11680101001000000000",
      },
    ] as const,
  },
  {
    id: "2",
    name: "힌터하우스",
    latitude: 1,
    longitude: 1,
    schedules: getAlldaySchedules("10:00", "21:00"),
    address: "경기도 안양시 만안구 석수동",
    addressElements: [
      {
        type: "SIDO",
        longName: "경기도",
        shortName: "경기도",
        code: "11",
      },
      {
        type: "SIGUGUN",
        longName: "안양시",
        shortName: "안양시",
        code: "11680",
      },
      {
        type: "DONGMYUN",
        longName: "석수동",
        shortName: "석수동",
        code: "1168010100",
      },
      {
        type: "RI",
        longName: "223-68번지",
        shortName: "223-68번지",
        code: "11680101001000000000",
      },
      {
        type: "ROAD_NAME",
        longName: "연남로",
        shortName: "연남로",
        code: "11680101001000000000",
      },
      {
        type: "BUILDING_NUMBER",
        longName: "223-68번지",
        shortName: "223-68번지",
        code: "11680101001000000000",
      },
      {
        type: "LAND_NUMBER",
        longName: "223-68번지",
        shortName: "223-68번지",
        code: "11680101001000000000",
      },
    ] as const,
  },
].map(
  (x) =>
    ({
      ...x,
      shortAddress: x.addressElements
        .filter((e) => ["SIDO", "SIGUGUN", "DONGMYUN"].includes(e.type))
        .map((e) => e.longName)
        .join(" "),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
);
export function space(id: string) {
  return SPACES.find((space) => space.id === id)!;
}

export const POSTS: Post[] = [
  {
    id: "1",
    createdAt: "2024-01-01",

    user: profile("1"),
    space: space("1"),

    images: [
      "/images/posts/1/1.jpg",
      "/images/posts/1/0.jpg",
      "/images/posts/1/2.jpg",
    ],
    content: `연남동에 작업하기좋은 공간을 발견했어요!

- 사람없고 조용한거 좋아한다면 추천해요
- 물이랑 간단한 스틱커피를 마실 수 있어요
- 최소 4시간 예약이지만, 시간당 천원이에요 👍
- 오히려 나갔다올 수 있어서 좋아요 :)`,
  },
  {
    id: "2",
    createdAt: "2024-01-01",

    user: profile("1"),
    space: space("2"),

    images: [
      "/images/posts/2/1.jpg",
      "/images/posts/2/0.jpg",
      "/images/posts/2/2.jpg",
    ],
    content: `여기가 안양 뷰 맛집!

- 햇살이 들어오는 통창뷰 신상 대형카페
- 좌석이 많고 조용해서 몰입하기 좋아요!
- 2층 창가 자리를 가장 추천해요👍
- 1층에 넓고 깨끗한 화장실도 있답니다`,
  },
];
