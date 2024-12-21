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
        "flex items-center gap-4 rounded-full border-4 bg-background pl-6 pr-2 py-2 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <SearchButton title="지역 검색">어디로 가시나요?</SearchButton>
        <Separator orientation="vertical" className="h-6" />
        <SearchButton title="인원 추가">
          <b className="text-primary font-semibold">1명</b>이 갈거에요
        </SearchButton>
      </div>
      <div className="flex-1" />
      <button className="rounded-full bg-primary p-3 text-primary-foreground hover:bg-primary/75">
        <Search className="size-5" />
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
    <button className="text-left px-4 w-60 transition-colors hover:text-primary hover:bg-accent">
      <b className="text-xs font-semibold">{title}</b>
      <br />
      <span className="text-gray-500">{children}</span>
    </button>
  );
}
