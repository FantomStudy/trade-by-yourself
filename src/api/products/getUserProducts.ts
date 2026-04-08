import type { Product } from "./getProducts";
import { api } from "../instance";

export const getUserProducts = (userId: number) =>
  api<Product[]>(`/product/user-products/${userId}`);
