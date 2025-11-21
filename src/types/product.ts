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
  description?: string;
  type: string | null;
  userId: number;
  category: {
    id: number;
    name: string;
  };
  fieldValues: Array<{
    id: number;
    name: string;
  }>;
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
