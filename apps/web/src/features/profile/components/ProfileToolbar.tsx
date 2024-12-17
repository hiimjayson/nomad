"use client";

import { Grid3x3, Rows3, Sparkles } from "lucide-react";
import { Suspense } from "react";
import {
  ProfileViewType,
  useProfileViewType,
} from "../hooks/useProfileViewType";
import { IconButton } from "@/components/atoms/IconButton";

function Resolved() {
  const [view, setView] = useProfileViewType();

  return (
    <div
      className="
    sticky top-20 bg-background-default opacity-95
    flex items-center h-10 gap-4 px-4
    rounded-full border border-typo-time text-[#cacaca]
    "
    >
      <IconButton>
        <Sparkles />
      </IconButton>
      <span>|</span>
      <IconButton
        active={view === ProfileViewType.Grid}
        onClick={() => setView(ProfileViewType.Grid)}
      >
        <Grid3x3 />
      </IconButton>
      <IconButton
        active={view === ProfileViewType.List}
        onClick={() => setView(ProfileViewType.List)}
      >
        <Rows3 />
      </IconButton>
    </div>
  );
}
export function ProfileToolbar() {
  return (
    <Suspense>
      <Resolved />
    </Suspense>
  );
}
