import type { Product } from "../../../_lib/types/product";
import type { RequestOptions } from "../../../_lib/utils/fetcher";

import { fetcher } from "../../../_lib/utils/fetcher";

export interface FeedFilters {
  // ID-based фильтры (старый API, для совместимости)
  categoryId?: number;
  // Slug-based фильтры (новый API)
  categorySlug?: string;
  // Динамические характеристики товара
  fieldValues?: Record<string, string>;
  // Пагинация
  limit?: number;
  // Цена
  maxPrice?: number;
  // Фильтр по рейтингу продавца (отзывы)
  maxRating?: number;
  minPrice?: number;
  minRating?: number;
  page?: number;
  // Тип продавца
  profileType?: "INDIVIDUAL" | "IP" | "OOO";
  // Регион
  region?: string;
  // Поиск
  search?: string;
  // Сортировка
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance";
  // Состояние товара
  state?: "NEW" | "USED";
  subCategoryId?: number;
  subCategorySlug?: string;
  typeId?: number;
  typeSlug?: string;
}

interface FeedProduct extends Product {
  hasPromotion: boolean;
}

export const getFeed = async (options?: RequestOptions & { query?: FeedFilters }) => {
  return fetcher<FeedProduct[]>("/product/all-products", options);
};
