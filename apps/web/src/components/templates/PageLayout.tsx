import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen w-full max-w-screen-2xl mx-auto py-4 sm:py-8">
      {children}
    </main>
  );
}

PageLayout.Header = function Header() {
  return (
    <>
      <header className="flex justify-between items-center p-4 fixed z-50 ml-[-2px] w-full max-w-screen-md md:border-x-2 h-16 border-b-2 border-typo-time bg-background-default">
        <Link href="/">
          <Image src="/images/logo.svg" alt="로고" width={120} height={22} />
        </Link>
      </header>
      <div className="h-16" />
    </>
  );
};

PageLayout.Footer = function Footer() {
  return (
    <footer className="px-4 pt-8 pb-12 w-full text-right border-t-2 border-typo-time bg-typo-time bg-opacity-10 mt-auto">
      <span className="text-sm text-typo-time text-opacity-60">
        © 2024 Cafegram
      </span>
    </footer>
  );
};
