import type { RequestOptions } from "@/utils/fetcher";

import { fetcher } from "@/utils/fetcher";

/**
 * TODO: Добавить returnType
 */
export const createCategory = async ({
  body,
  options,
}: RequestOptions<{ name: string }>) =>
  fetcher<unknown>("/category/create-category", {
    ...options,
    body,
    method: "POST",
  });
