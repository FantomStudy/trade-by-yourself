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
  categoryId?: number;
  description?: string;
  state?: string;
  subcategoryId?: number;
  typeId?: number;
  fieldValues?: Record<string, string> | string[];
  seller?: {
    id: number;
    fullName: string;
    phoneNumber: string;
    profileType: string;
    rating: number;
    reviewsCount: number;
  };
}
