import type { RequestOptions } from "../../../../../_lib/utils/fetcher";

import { fetcher } from "../../../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const deleteSubcategory = async (id: number, options?: RequestOptions) =>
  fetcher<unknown>(`/subcategory/delete-subcategory/${id}`, {
    ...options,
    method: "DELETE",
  });
