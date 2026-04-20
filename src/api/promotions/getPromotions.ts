import { api } from "../instance";

export interface Promotion {
  id: number;
  name: string;
  pricePerDay: number;
}

export const getPromotions = () => api<Promotion[]>("/promotion/all-promotions");

