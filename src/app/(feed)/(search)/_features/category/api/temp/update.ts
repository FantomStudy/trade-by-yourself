import type { RequestOptions } from "@/utils/fetcher";

import { fetcher } from "@/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const updateCategory = async (
  id: number,
  { body, options }: RequestOptions<{ name: string }>
) =>
  fetcher<unknown>(`/category/update-category/${id}`, {
    ...options,
    body,
    method: "PUT",
  });
