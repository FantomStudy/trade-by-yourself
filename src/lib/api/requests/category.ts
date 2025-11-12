import type { Category, Subcategory } from "@/types";

import { api } from "../instance";

export const getAllCategories = async () =>
  api.get<Category[]>("/category/all-categories");

export const getAllSubcategories = async () =>
  api.get<Subcategory[]>("/category/all-subcategories");
