"use client";

import { cn } from "@/lib/cn";
import { Grid3x3, Rows3, SlidersHorizontal } from "lucide-react";
import { HTMLAttributes, Suspense } from "react";
import {
  ProfileViewType,
  useProfileViewType,
} from "../hooks/useProfileViewType";

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
      <Button>
        <SlidersHorizontal />
      </Button>
      <span>|</span>
      <Button
        active={view === ProfileViewType.Grid}
        onClick={() => setView(ProfileViewType.Grid)}
      >
        <Grid3x3 />
      </Button>
      <Button
        active={view === ProfileViewType.List}
        onClick={() => setView(ProfileViewType.List)}
      >
        <Rows3 />
      </Button>
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

function Button({
  className,
  active,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "p-1 rounded-lg bg-opacity-15 cursor-pointer",
        active && "text-typo-time bg-typo-time",
        className
      )}
      {...props}
    />
  );
}
