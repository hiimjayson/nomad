import { SVGProps } from "react";

export function ArrowRightLongIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 24"
      stroke="currentColor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30 8L34 12L30 16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12H33"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
