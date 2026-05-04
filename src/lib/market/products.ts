import type { ProductCard, ProductSortBy } from "@/types";

import { apiGet } from "./api";

export interface CatalogParams {
  page?: number;
  limit?: number;
  sortBy?: ProductSortBy;
  search?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  region?: string;
}

export async function getCatalog(params: CatalogParams) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value) !== "") {
      query.set(key, String(value));
    }
  }

  return apiGet<ProductCard[]>(`/product/all-products?${query.toString()}`);
}

export async function getRecommended(subcategoryId: number, limit = 12) {
  return apiGet<ProductCard[]>(`/product/recommended?subcategoryId=${subcategoryId}&limit=${limit}`);
}
