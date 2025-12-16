import type { Product } from "../../../_lib/types/product";
import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

export interface FeedFilters {
  categoryId?: number;
  fieldValues?: Record<string, string>;
  limit?: number;
  maxPrice?: number;
  minPrice?: number;
  page?: number;
  profileType?: "INDIVIDUAL" | "OOO";
  region?: string;
  search?: string;
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance";
  state?: "NEW" | "USED";
  subCategoryId?: number;
  typeId?: number;
}

interface FeedProduct extends Product {
  hasPromotion: boolean;
}

export const getFeed = async (
  options?: RequestOptions & { query?: FeedFilters },
) => {
  return fetcher<FeedProduct[]>("/product/all-products", options);
};
