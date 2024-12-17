import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { isEmptyStringOrNil } from "@/lib/string";

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
      function set(value: string | null) {
        const newSearchParams = new URLSearchParams(searchParams);

        if (isEmptyStringOrNil(value)) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }

        router[strategy](`${pathname}?${newSearchParams.toString()}`);
      },
    ] as const;
  }, [searchParams, key, router, strategy, pathname]);
}
