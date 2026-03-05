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
  // categoryName: string;
  categorySlug: string;
  // subCategoryName: string;
  subCategorySlug: string;
  // typeName: string;
  typeSlug: string;
}

export interface DetailedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  address: string;
  videoUrl: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  subCategory: {
    id: number;
    name: string;
    slug: string;
  };
  type: {
    id: number;
    name: string;
    slug: string;
  };
  fieldValues: unknown;
  isFavorited: boolean;
  seller: {
    id: number;
    fullName: string;
    profileType: string;
    phoneNumber: string;
    balance: number;
    bonusBalance: number;
    photo: string | null;
    usedFreeAds: number;
    rating: number;
    reviewsCount: number;
    adsLimit: {
      total: number;
      used: number;
      remaining: number;
      costPerAd: number;
    };
  };
}
