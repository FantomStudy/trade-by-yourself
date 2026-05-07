import type { Product } from "./types";
import { api } from "../instance";

export const getUserProducts = (userId: number) =>
  api<Product[]>(`/product/user-products/${userId}`);
