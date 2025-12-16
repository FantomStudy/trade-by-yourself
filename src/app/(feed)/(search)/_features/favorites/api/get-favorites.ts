import type { Product } from "../../../_lib/types/product";
import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

export const getFavorites = async (options?: RequestOptions) =>
  fetcher<Product[]>("/product/my-favorites", options);
