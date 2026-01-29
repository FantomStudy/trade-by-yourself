export interface Product {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  images: string[];
  isFavorited: boolean;
  isHide?: boolean;
  moderateState?: "APPROVED" | "DENIDED" | "DENIED" | "MODERATE";
  price: number;
  subCategoryName?: string;
  userId: number;
  videoUrl?: string | null;
  hasPromotion?: boolean;
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
    rating: number;
    reviewsCount: number;
  };
  subCategory: {
    id: number;
    name: string;
  };
}
