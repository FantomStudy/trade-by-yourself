import type { RequestOptions } from "@/utils/fetcher";

import { fetcher } from "@/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const deleteCategory = async (
  id: number,
  { options }: RequestOptions = {}
) =>
  fetcher<unknown>(`/category/delete-category/${id}`, {
    ...options,
    method: "DELETE",
  });
