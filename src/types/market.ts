export interface ProductCard {
  id: number;
  name: string;
  price: number;
  images: string[];
  address: string;
  createdAt: string;
  isFavorited: boolean;
  hasPromotion: boolean;
  promotionLevel: number;
  promotionName?: string | null;
  sellerRating?: number | null;
  sellerVerified?: boolean;
  viewsCount?: number;
  popularityScore?: number;
  badges?: string[];
}

export interface PromotionTariff {
  id: number;
  name: string;
  pricePerDay: number;
}

export interface Appeal {
  id: number;
  productId: number;
  userId: number;
  reason: string;
  status: "OPEN" | "APPROVED" | "REJECTED";
  reviewedByUserId?: number | null;
  reviewComment?: string | null;
  createdAt: string;
  updatedAt: string;
}
