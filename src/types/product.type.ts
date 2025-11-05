export interface Product {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  images: string[];
  price: number;
}

export interface ExtendedProduct extends Product {
  brand: string;
  categoryId: number;
  description: string;
  model: string;
  state: string;
  subcategoryId: number;
}
