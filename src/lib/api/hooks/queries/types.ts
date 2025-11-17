import type { UseQueryOptions } from "@tanstack/react-query";

export type QueryHookOptions<TData> = Omit<
  UseQueryOptions<TData>,
  "queryFn" | "queryKey"
>;
