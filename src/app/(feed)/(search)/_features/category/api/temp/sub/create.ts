import type { RequestOptions } from "@/utils/fetcher";

import { fetcher } from "@/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const createSubcategory = async ({
  body,
  options,
}: RequestOptions<{ name: string }>) =>
  fetcher<unknown>("/subcategory/create-subcategory", {
    ...options,
    body,
    method: "POST",
  });
