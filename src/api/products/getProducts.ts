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

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface DetailedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  isHide: boolean;
  images: string[];
  address: string;
  videoUrl: string | null;
  category: ProductCategory;
  subCategory: ProductCategory;
  type: ProductCategory | null;
  fieldValues: Record<string, string>[];
  isFavorited: boolean;
  seller: ProductUser;
}

export interface ProductUser {
  id: number;
  fullName: string;
  profileType: string;
  phoneNumber: string;
  photo: string | null;
  rating: number;
  reviewsCount: number;
}

export const getProducts = (query?: ProductFilters) =>
  api<Product[]>("/product/all-products", { query });
