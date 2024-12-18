/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Post } from "@/features/post-detail/types";
import { ArrowRightLongIcon } from "@/icons/arrow-right-long";
import { cn } from "@/lib/cn";
import Link from "next/link";

function GridFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `
      border-2 border-typo-time 
      flex items-center justify-center
      aspect-square
      `,
        className
      )}
    >
      {children}
    </div>
  );
}
function Grid({ id, images, space }: Pick<Post, "id" | "images" | "space">) {
  return (
    <div className="aspect-square">
      <GridFrame className="size-full">
        <Link className="size-full" href={`/p/${id}`}>
          <img className="size-full object-cover" src={images[0]} />
        </Link>
      </GridFrame>
      <div className="p-2">
        <p className="text-typo-time text-lg md:text-xl font-bold text-ellipsis">
          {space.name}
        </p>
        <p className="text-typo-time text-sm md:text-lg opacity-85 mb-2 text-ellipsis line-clamp-1">
          {space.shortAddress}
        </p>
      </div>
    </div>
  );
}

function ListFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-52 border-2 border-typo-time flex items-center justify-center">
      {children}
    </div>
  );
}
function List({
  id,
  images,
  space,
  content,
}: Pick<Post, "id" | "images" | "space" | "content">) {
  return (
    <ListFrame>
      <Link className="size-full flex flex-col" href={`/p/${id}`}>
        <div
          className="
        flex items-center gap-3
        w-full p-3 
        border-b border-typo-time border-opacity-60
        "
        >
          <img
            className="h-32 aspect-square object-cover border border-typo-time"
            src={images[0]}
          />
          <div className="flex flex-col flex-1">
            <p className="text-typo-time text-2xl font-bold">{space.name}</p>
            <p className="text-typo-time text-sm opacity-50 mb-2">
              {space.shortAddress}
            </p>
            <p className="text-typo-secondary opacity-80 text-sm whitespace-pre-wrap text-ellipsis line-clamp-3">
              {content}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 px-4">
          <ArrowRightLongIcon className="h-6 ml-auto" />
        </div>
      </Link>
    </ListFrame>
  );
}

export const PostCard = {
  GridFrame,
  Grid,
  ListFrame,
  List,
};
