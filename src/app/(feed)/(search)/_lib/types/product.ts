import type { User } from "./user";

/**
 * TODO: Пересмотреть логику видео-юрл
 */
export interface Product {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  images: string[];
  isFavorited: boolean;
  price: number;
  quantity: number;
  userId: number;
  videoUrl: null;
}

export interface DetailedProduct extends Product {
  id: number;
  name: string;
  address: string;
  description: string;
  fieldValues: { id: number; [key: string]: number | string }[];
  images: string[];
  isFavorited: false;
  price: number;
  seller: User;
  userId: number;
  videoUrl: null;
  category: {
    id: number;
    name: string;
  };
  subCategory: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  } | null;
}
