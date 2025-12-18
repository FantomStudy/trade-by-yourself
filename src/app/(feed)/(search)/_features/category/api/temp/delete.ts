import type { RequestOptions } from "../../../../_lib/utils/fetcher";

import { fetcher } from "../../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const deleteCategory = async (
  id: number,
  options?: RequestOptions
) =>
  fetcher<unknown>(`/category/delete-category/${id}`, {
    ...options,
    method: "DELETE",
  });
