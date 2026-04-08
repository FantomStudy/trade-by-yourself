import type { Category } from "@/types";
import { api } from "../instance";

export const getCategory = (slug: string) => api<Category>(`/category/slug/${slug}`);
