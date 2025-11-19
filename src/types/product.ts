export interface Product {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  images: string[];
  isFavorited: boolean;
  price: number;
  userId: number;
}

export interface ExtendedProduct extends Product {
  brand?: string;
  categoryId: number;
  description?: string;
  model?: string;
  state: string;
  subcategoryId: number;
  seller?: {
    id: number;
    fullName: string;
    phoneNumber: string;
    profileType: string;
    rating: number;
    reviewsCount: number;
  };
}
