import type { DetailedProduct } from "../../../_lib/types/product";
import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

export const getProductById = async (id: number, options?: RequestOptions) =>
  fetcher<DetailedProduct>(`/product/product-card/${id}`, options);
