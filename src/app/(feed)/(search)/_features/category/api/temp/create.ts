import type { RequestOptions } from "../../../../_lib/utils/fetcher";

import { fetcher } from "../../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const createCategory = async (
  body: { name: string },
  options?: RequestOptions
) =>
  fetcher<unknown>("/category/create-category", {
    ...options,
    body,
    method: "POST",
  });
