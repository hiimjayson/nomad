"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          onClick={scrollToTop}
          className="flex items-center gap-2"
        >
          <Image
            src="/images/logo.svg"
            alt="Nomad Logo"
            width={160}
            height={18}
            className="rounded"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {/* <Button variant="ghost">Nomad 소개</Button> */}
          <Button variant="outline">지역 요청하기</Button>
          <Button>장소 공유하기</Button>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
