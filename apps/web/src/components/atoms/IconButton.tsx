"use client";

import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

export function IconButton({
  className,
  active,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "p-1 rounded-lg !bg-opacity-15 cursor-pointer hover:bg-typo-time transition-all",
        active && "text-typo-time bg-typo-time",
        className
      )}
      {...props}
    />
  );
}
