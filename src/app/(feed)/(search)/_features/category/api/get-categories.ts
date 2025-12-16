import type { Category } from "../../../_lib/types/category";
import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

export const getCategories = async (options?: RequestOptions) =>
  fetcher<Category[]>("/category/find-all", options);
