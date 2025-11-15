import { UseQueryOptions } from "@tanstack/react-query";

export type QueryHookOptions<TData> = Omit<
  UseQueryOptions<TData>,
  "queryKey" | "queryFn"
>;
