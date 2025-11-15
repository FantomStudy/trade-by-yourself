import type { Category, Subcategory } from "@/types";

import { api } from "../instance";

export const getAllCategories = async () =>
  api<Category[]>("/category/all-categories");

export const getAllSubcategories = async () =>
  api<Subcategory[]>("/category/all-subcategories");
