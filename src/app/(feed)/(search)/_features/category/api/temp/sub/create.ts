import type { RequestOptions } from "../../../../../_lib/utils/fetcher";

import { fetcher } from "../../../../../_lib/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const createSubcategory = async (
  body: { name: string },
  options?: RequestOptions,
) =>
  fetcher<unknown>("/subcategory/create-subcategory", {
    ...options,
    body,
    method: "POST",
  });
