import { ValueOf } from "@/types/util";
import { Profile } from "../profile/const";

export type AddressElementType =
  | "SIDO"
  | "SIGUGUN"
  | "DONGMYUN"
  | "RI"
  | "ROAD_NAME"
  | "BUILDING_NUMBER"
  | "BUILDING_NAME"
  | "LAND_NUMBER"
  | "POSTAL_CODE";

export const DayType = {
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
  SAT: "SAT",
  SUN: "SUN",
} as const;
export type DayType = ValueOf<typeof DayType>;
export interface SpaceSchedule {
  day: DayType;
  openTime: string;
  closeTime: string;
}

export function getAlldaySchedules(open: string, close: string) {
  return Object.values(DayType).map((day) => ({
    day,
    openTime: open,
    closeTime: close,
  }));
}

export interface Space {
  id: string;
  name: string;

  schedules: SpaceSchedule[];

  latitude: number;
  longitude: number;

  address: string;
  shortAddress: string;
  addressElements: {
    type: AddressElementType;
    longName: string;
    shortName: string;
    code: string;
  }[];
}

export type BestType = "mood" | "taste" | "focus";
export type ReviewLevel = "1" | "2" | "3";

export interface Post {
  id: string;
  createdAt: string;

  user: Profile;
  space: Space;

  images: string[];
  content: string;

  americanoPrice?: number;
  wifiLevel?: ReviewLevel;
  chargeLevel?: ReviewLevel;
  tasteLevel?: ReviewLevel;
  acceptableLevel?: ReviewLevel;
  moodLevel?: ReviewLevel;
  quietLevel?: ReviewLevel;
  seatComfortLevel?: ReviewLevel;
  toiletCleanLevel?: ReviewLevel;
}
