import { api } from "../instance";

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: "NEW" | "USED";
  region?: string;
  profileType?: "INDIVIDUAL" | "IP" | "OOP";
  fieldValues?: Record<string, string>;
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance";
  page?: number;
  limit?: number;
}

export interface Product {
  id: number;
  images: string[];
  name: string;
  address: string;
  createdAt: string;
  price: number;
  videoUrl: string | null;
  isFavorited: boolean;
  hasPromotion: boolean;
  promotionLevel: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  subCategoryId: number;
  subCategoryName: string;
  subCategorySlug: string;
  typeId: number;
  typeName: string;
  typeSlug: string;
}

export const getProducts = (query?: ProductFilters) =>
  api<Product[]>("/product/all-products", { query });
