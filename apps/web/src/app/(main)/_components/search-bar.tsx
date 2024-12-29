import { Search } from "lucide-react";

import { cn } from "@/lib/cn";
import { Separator } from "@/components/ui/separator";

export function SearchBar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row w-full md:w-auto items-center gap-4 rounded-sm md:rounded-full border-4 bg-background px-4 py-2 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <SearchButton title="지역 검색">어디로 가시나요?</SearchButton>
        <Separator orientation="vertical" className="hidden sm:block h-6" />
        <Separator
          orientation="horizontal"
          className="block sm:hidden w-full"
        />
        <SearchButton title="인원 추가">
          <b className="text-primary font-semibold">1명</b>이 갈거에요
        </SearchButton>
      </div>
      <div className="hidden sm:block flex-1" />
      <button className="w-full sm:w-auto rounded-full bg-primary p-3 text-primary-foreground hover:bg-primary/75">
        <Search className="mx-auto size-5" />
        <span className="sr-only">검색</span>
      </button>
    </div>
  );
}

function SearchButton({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button className="w-full sm:w-60 text-left px-4 py-2 rounded-lg transition-colors hover:text-primary hover:bg-accent">
      <b className="text-xs font-semibold">{title}</b>
      <br />
      <span className="text-gray-500">{children}</span>
    </button>
  );
}
