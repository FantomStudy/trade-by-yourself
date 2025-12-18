import type { RequestOptions } from "../../../../_lib/utils/fetcher";

import { fetcher } from "../../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const updateCategory = async (
  id: number,
  body: { name: string },
  options?: RequestOptions
) =>
  fetcher<unknown>(`/category/update-category/${id}`, {
    ...options,
    body,
    method: "PUT",
  });
