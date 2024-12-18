/* eslint-disable @next/next/no-img-element */

import { FadeIn } from "@/components/atoms/anim/FadeIn";
import { Bio } from "@/components/atoms/Bio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/atoms/Carousel";
import { Divider } from "@/components/atoms/Divider";
import { POSTS } from "@/features/post-detail/const";
import { pick } from "es-toolkit";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = POSTS.find((post) => post.id === postId);

  if (!post) {
    return notFound();
  }

  return {
    title: `${post.space.name}(${post.space.shortAddress}) 후기 - Cafegram`,
    description: `${post.user.nickname}님의 Cafegram 카페 후기 보기`,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = POSTS.find((post) => post.id === postId);

  if (!post) {
    return notFound();
  }

  return (
    <FadeIn className="flex flex-col w-full py-10">
      <Bio
        {...pick(post.user, ["avatar", "nickname", "username"])}
        className="px-6"
      />

      <Divider className="my-6" />

      <Carousel>
        <CarouselContent className="-ml-4 pl-8">
          {post.images.map((image) => (
            <CarouselItem key={image} className="pl-2 basis-2/3 md:basis-1/3">
              <img
                src={image}
                alt={post.space.name}
                className="w-full aspect-square object-cover"
              />
            </CarouselItem>
          ))}
          <CarouselItem className="pl-2 basis-2/3 md:basis-1/3" />
        </CarouselContent>
      </Carousel>

      <div className="flex flex-col gap-1 px-6 mt-4 mb-2">
        <p className="text-typo-primary text-xl font-bold text-ellipsis">
          {post.space.name}
        </p>
        <p className="text-typo-time text-opacity-75 font-medium text-ellipsis">
          {post.space.shortAddress}
        </p>
      </div>

      <Divider className="my-6" />

      <div className="flex flex-col p-6">
        <p className="text-typo-primary text-2xl font-bold mb-6">Review</p>
        <p className="text-typo-time text-opacity-70 font-medium whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
    </FadeIn>
  );
}
