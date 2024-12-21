import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
import { CategoryBar } from "@/components/category-bar";
import { SearchBar } from "@/components/search-bar";
import { cn } from "@/lib/cn";

export const CONTAINER_PADDING_CLASS = "px-3 lg:px-10 3xl:px-20";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="Nomad Logo"
              width={160}
              height={18}
              className="rounded"
            />
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost">Nomad 소개</Button>
            <Button variant="outline">지역 요청하기</Button>
            <Button>장소 공유하기</Button>
          </nav>
        </div>
      </header>
      <SearchBar className="mx-auto flex-1 mb-6" />
      <CategoryBar />

      <main
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 4xl:grid-cols-6 p-6",
          CONTAINER_PADDING_CLASS
        )}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden bg-transparent"
          >
            <Link href="#" className="block">
              <div className="aspect-square overflow-hidden rounded-xl">
                <Image
                  src="/images/posts/2/0.jpg"
                  alt="Property"
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
                  <h3 className="font-semibold">힌터하우스</h3>
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>4.9</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  경기 안양시 석수동
                </p>
                <p className="text-sm text-muted-foreground">Jan 5-10</p>
                <p className="font-semibold">₩180,000 per night</p>
              </div>
            </Link>
          </Card>
        ))}
      </main>
    </div>
  );
}
