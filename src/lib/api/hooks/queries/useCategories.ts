import type { QueryHookOptions } from "./types";
import type { Category } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getAllCategories } from "../../requests";

export const CATEGORIES_QUERY_KEY = ["categories"];

export const useCategories = (options?: QueryHookOptions<Category[]>) => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getAllCategories,
    ...options,
  });
};
