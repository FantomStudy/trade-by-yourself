export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  state?: "NEW" | "USED";
  region?: string;
  profileType?: "INDIVIDUAL" | "IP" | "OOP";
  hasSecureDeal?: boolean;
  fieldValues?: Record<string, string>;
  sortBy?: "date_asc" | "date_desc" | "price_asc" | "price_desc" | "relevance" | "seller_rating" | "distance";
  page?: number;
  limit?: number;
}

export interface Product {
  id: number;
  images: string[];
  name: string;
  address: string;
  createdAt: string;
  expiresAt?: string;
  daysUntilExpiration?: number;
  isExpired?: boolean;
  price: number;
  quantity?: number;
  userId?: number;
  isHide?: boolean;
  isReserved?: boolean;
  videoUrl?: string | null;
  isFavorited: boolean;
  hasPromotion: boolean;
  isPaid?: boolean;
  promotionLevel: number;
  promotionName?: string | null;
  sellerRating?: number | null;
  sellerVerified?: boolean;
  viewsCount?: number;
  todayViewsCount?: number;
  popularityScore?: number;
  badges?: string[];
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
  quantity?: number;
  isHide: boolean;
  images: string[];
  address: string;
  videoUrl: string | null;
  category: ProductCategory;
  subCategory: ProductCategory;
  type: ProductCategory | null;
  fieldValues: Record<string, string>[];
  isFavorited: boolean;
  hasPromotion?: boolean;
  isPaid?: boolean;
  promotionLevel?: number;
  promotionName?: string | null;
  viewsCount?: number;
  todayViewsCount?: number;
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
