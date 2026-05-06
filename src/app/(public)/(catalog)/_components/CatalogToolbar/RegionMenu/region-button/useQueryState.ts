import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryState = (key: string): [string | null, (next: string | null) => void] => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(key);

  const setValue = (next: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next === null || next === "") {
      params.delete(key);
    } else {
      params.set(key, next);
    }

    const qs = params.toString();
    router.replace((qs ? `${pathname}?${qs}` : pathname) as Route, { scroll: false });
  };

  return [value, setValue];
};
