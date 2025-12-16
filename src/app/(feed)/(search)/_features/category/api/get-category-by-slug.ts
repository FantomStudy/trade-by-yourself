import type { Category } from "../../../_lib/types/category";
import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

// TODO: Пересмотреть типы и привести на бэке к единому виду
export const getCategoryBySlug = async (
  slug: string,
  options?: RequestOptions,
) => fetcher<Category>(`/category/slug/${slug}`, options);
