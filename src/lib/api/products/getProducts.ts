import type { Product, ProductFilters } from "./types";
import { api } from "../instance";

export const getProducts = async (query?: ProductFilters): Promise<Product[]> => {
  try {
    const res = await api<Product[]>("/product/all-products", { query });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

