import type { RequestOptions } from "@/utils/fetcher";

import { fetcher } from "@/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const updateSubcategory = async (
  id: number,
  { body, options }: RequestOptions<{ name: string }>
) =>
  fetcher<unknown>(`/subcategory/update-subcategory/${id}`, {
    ...options,
    body,
    method: "PUT",
  });
