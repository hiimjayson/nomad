import type { Nil, Nilable } from "@/types/util";

export function isEmptyStringOrNil(value: Nilable<string>): value is Nil | "" {
  return value === "" || value == null;
}
