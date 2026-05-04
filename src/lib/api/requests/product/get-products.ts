import type { Product, ProductsQueryParams } from "@/types";

import { api } from "@/api/instance";

function buildProductsQuery(params?: ProductsQueryParams) {
  if (!params) return "";

  const query = new URLSearchParams();
  const entries = Object.entries(params) as Array<[keyof ProductsQueryParams, string | number | undefined]>;

  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export const getProducts = async (params?: ProductsQueryParams) =>
  api<Product[]>(`/product/all-products${buildProductsQuery(params)}`);
