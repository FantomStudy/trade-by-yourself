import type { DetailedProduct } from "./getProducts";
import { api } from "../instance";

export const getProduct = (id: number) => api<DetailedProduct>(`/product/product-card/${id}`);
