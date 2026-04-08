import type { Category } from "@/types";
import { api } from "../instance";

export const getCategories = () => api<Category[]>("/category/find-all");
