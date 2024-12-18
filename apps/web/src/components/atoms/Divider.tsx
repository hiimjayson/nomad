import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

export function Divider({ className, ...props }: Props) {
  return (
    <div
      className={cn("w-full h-px bg-typo-time bg-opacity-75", className)}
      {...props}
    />
  );
}
