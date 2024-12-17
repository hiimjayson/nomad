import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export function useSearchParamState(
  key: string,
  strategy: "replace" | "push" = "replace"
) {
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const router = useRouter();

  return useMemo(() => {
    const value = searchParams.get(key);

    return [
      value,
      function set(value: string) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(key, value);

        router[strategy](`${pathname}?${newSearchParams.toString()}`);
      },
    ] as const;
  }, [searchParams, key, router, strategy, pathname]);
}
