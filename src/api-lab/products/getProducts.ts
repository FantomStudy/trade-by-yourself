import type { Product } from "@/types/products";
import { api } from "../instance";

export interface ProductsFilters {
  search?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: "NEW" | "USED";
  region?: string;
  profileType?: "INDIVIDUAL" | "IP" | "OOO";
  fieldValues?: Record<string, string>;
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance";
  page?: number;
  limit?: number;
}

export const getProducts = async (filters?: ProductsFilters) => {
  return api<Product[]>("/product/all-products", { query: filters });
};
