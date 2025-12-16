import type { RequestOptions } from "@/utils/fetcher";

import { fetcher } from "@/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const deleteSubcategory = async (
  id: number,
  { options }: RequestOptions = {}
) =>
  fetcher<unknown>(`/subcategory/delete-subcategory/${id}`, {
    ...options,
    method: "DELETE",
  });
