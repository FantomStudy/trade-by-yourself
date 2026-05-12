export interface Product {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  images: string[];
  isFavorited: boolean;
  isHide?: boolean;
  moderateState?: "APPROVED" | "DENIDED" | "DENIED" | "MODERATE" | "DRAFT";
  price: number;
  quantity: number;
  subCategoryName?: string;
  userId: number;
  videoUrl?: string | null;
  hasPromotion?: boolean;
  promotionLevel?: number;
  promotionName?: string | null;
  sellerRating?: number | null;
  sellerVerified?: boolean;
  viewsCount?: number;
  popularityScore?: number;
  badges?: string[];
}

export interface ExtendedProduct extends Product {
  description?: string;
  fieldValues?: Array<{ id: number; [key: string]: number | string }>;
  type: string | null;
  videoUrl?: string | null;
  category: {
    id: number;
    name: string;
  };
  seller: {
    id: number;
    fullName: string;
    phoneNumber: string;
    profileType: string;
    photo: string | null;
    rating: number;
    reviewsCount: number;
  };
  subCategory: {
    id: number;
    name: string;
  };
}

export type ModerationFilter = "ALL" | "DENIED" | "MANUAL" | "APPROVED_AI";

export type ModerationState = "DENIDED" | "MODERATE" | "AI_REVIEWED" | "APPROVED";

export interface ModerationProduct {
  id: number;
  name: string;
  price: number;
  images: string[];
  moderateState: ModerationState;
  moderationRejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: number; name: string };
  subCategory: { id: number; name: string };
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

export interface ModerationProductDetail extends Omit<ModerationProduct, "moderateState"> {
  moderateState: ModerationState;
  description: string;
  videoUrl: string | null;
  type: { id: number; name: string } | null;
  user: ModerationProduct["user"] & { profileType: string };
  fieldValues: Array<{ value: string; field: { id: number; name: string } }>;
}

export interface ModerationProductsResponse {
  items: ModerationProduct[];
  total: number;
  page: number;
  pages: number;
}

export type ProductSortBy =
  | "relevance"
  | "date_desc"
  | "date_asc"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "seller_rating";

export interface ProductsQueryParams {
  search?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  region?: string;
  profileType?: string;
  fieldValues?: string;
  sortBy?: ProductSortBy;
  page?: number;
  limit?: number;
}
