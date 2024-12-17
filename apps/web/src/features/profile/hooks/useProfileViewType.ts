import { useMemo } from "react";
import { useSearchParamState } from "@/hooks/useSearchParamState";
import { ValueOf } from "@/types/util";

export const ProfileViewType = {
  Grid: "g",
  List: "l",
} as const;
export type ProfileViewType = ValueOf<typeof ProfileViewType>;

export function useProfileViewType() {
  const [view, setView] = useSearchParamState("v");

  return useMemo(() => {
    const _view = Object.values(ProfileViewType).includes(
      view as ProfileViewType
    )
      ? view
      : ProfileViewType.Grid;

    return [_view, setView] as const;
  }, [view, setView]);
}
