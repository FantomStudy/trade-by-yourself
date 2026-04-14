import type { DetailedProduct } from "./types";
import { api } from "../instance";

export const getProduct = (id: number) => api<DetailedProduct>(`/product/product-card/${id}`);
