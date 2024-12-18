import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isEmptyStringOrNil } from "@/lib/string";

export function useSearchParamState(
  key: string,
  strategy: "replace" | "push" = "replace"
) {
  const searchParams = useSearchParams();
  const [_value, _setValue] = useState<string | null>(null);

  useEffect(() => {
    _setValue(searchParams.get(key));
  }, [searchParams, key]);

  const pathname = usePathname();
  const router = useRouter();

  return useMemo(() => {
    return [
      _value,
      function set(value: string | null) {
        const newSearchParams = new URLSearchParams(searchParams);

        if (isEmptyStringOrNil(value)) {
          newSearchParams.delete(key);
          _setValue(null);
        } else {
          newSearchParams.set(key, value);
          _setValue(value);
        }

        router[strategy](`${pathname}?${newSearchParams.toString()}`);
      },
    ] as const;
  }, [searchParams, key, router, strategy, pathname, _value]);
}
