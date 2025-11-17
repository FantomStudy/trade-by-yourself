export interface Product {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  images: string[];
  isLiked: boolean;
  price: number;
}

export interface ExtendedProduct extends Product {
  brand?: string;
  categoryId: number;
  description?: string;
  isFavorited?: boolean;
  model?: string;
  seller?: {
    fullName: string;
    id: number;
    phoneNumber: string;
    profileType: string;
    rating: number;
    reviewsCount: number;
  };
  state: string;
  subcategoryId: number;
  userId: number;
}
