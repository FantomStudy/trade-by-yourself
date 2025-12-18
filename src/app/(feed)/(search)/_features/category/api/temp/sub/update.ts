import type { RequestOptions } from "../../../../../_lib/utils/fetcher";

import { fetcher } from "../../../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const updateSubcategory = async (
  id: number,
  body: { name: string },
  options?: RequestOptions
) =>
  fetcher<unknown>(`/subcategory/update-subcategory/${id}`, {
    ...options,
    body,
    method: "PUT",
  });
