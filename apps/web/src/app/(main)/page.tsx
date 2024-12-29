import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

import { CategoryBar } from "./_components/category-bar";
import { SearchBar } from "./_components/search-bar";
import { CONTAINER_PADDING_CLASS } from "./_const";
import { CafeData } from "@/interfaces/cafe";
import { Header } from "./_components/header";

export const revalidate = 3600; // 1시간마다 재생성

async function getCafes(): Promise<CafeData[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cafes`,
      {
        next: { revalidate: 0 },
      }
    );
    const data = await response.json();
    return data.cafes;
  } catch (error) {
    console.error("Error fetching cafes:", error);
    return [];
  }
}

export default async function Home() {
  const cafes = await getCafes();

  return (
    <div className="flex flex-col items-center">
      <Header />
      <SearchBar className="mx-auto flex-1 mb-6" />
      <CategoryBar />

      <main
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 4xl:grid-cols-6 p-6",
          CONTAINER_PADDING_CLASS
        )}
      >
        {cafes.map((cafe, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden bg-transparent"
          >
            <Link href="#" className="block">
              <div className="aspect-square overflow-hidden rounded-xl">
                <Image
                  src="/images/posts/2/0.jpg"
                  alt={cafe.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{cafe.name}</h3>
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{cafe.beautyScore}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {cafe.shortAddress}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cafe.openTime} - {cafe.closeTime}
                </p>
                <p className="font-semibold">아메리카노 {cafe.minPrice}원</p>
              </div>
            </Link>
          </Card>
        ))}
      </main>
    </div>
  );
}
