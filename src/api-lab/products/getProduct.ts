import type { DetailedProduct } from "@/types/products";
import { api } from "../instance";

export const getProduct = async (id: number) =>
  api<DetailedProduct>(`/product/product-card/${id}`);
