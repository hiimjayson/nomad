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

export interface Space {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  latitude: number;
  longitude: number;

  address: string;
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
  space: string;

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
