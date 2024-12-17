import { cn } from "@/lib/cn";
import { HTMLProps, SVGProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  src: string;
}

export function Avatar({ src, className, ...props }: Props) {
  return (
    <div className={cn("size-20", className)} {...props}>
      <SquircleFrame src={src} />
    </div>
  );
}

function SquircleFrame({
  className,
  src,
  ...props
}: SVGProps<SVGSVGElement> & { src: string }) {
  return (
    <svg viewBox="0 0 88 88" className={cn("size-full", className)} {...props}>
      <defs>
        <path
          id="shapeSquircle"
          d="M44 1C75.3654 1 87 12.6346 87 44C87 75.3654 75.3654 87 44 87C12.6346 87 1 75.3654 1 44C1 12.6346 12.6346 1 44 1Z"
        />

        <clipPath id="clipSquircle">
          <use xlinkHref="#shapeSquircle" />
        </clipPath>
      </defs>

      <path d="M44 0.5C60.0072 0.5 70.8373 3.47326 77.682 10.318C84.5267 17.1627 87.5 27.9928 87.5 44C87.5 60.0072 84.5267 70.8373 77.682 77.682C70.8373 84.5267 60.0072 87.5 44 87.5C27.9928 87.5 17.1627 84.5267 10.318 77.682C3.47326 70.8373 0.5 60.0072 0.5 44C0.5 27.9928 3.47326 17.1627 10.318 10.318C17.1627 3.47326 27.9928 0.5 44 0.5Z" />
      <image
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#clipSquircle)"
        xlinkHref={src}
      />
    </svg>
  );
}
