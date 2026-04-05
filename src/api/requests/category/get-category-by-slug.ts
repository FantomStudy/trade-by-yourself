import type { Category } from "@/types";

import { api } from "../../instance";

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  slug: string;
  subcategoryTypes: SubcategoryType[];
}

interface SubcategoryType {
  id: number;
  name: string;
  fields: TypeField[];
  slug: string;
  subCategoryId: number;
}

interface TypeField {
  id: number;
  name: string;
  isRequired: boolean;
  typeId: number;
}

export interface CategoryWithDetails extends Category {
  subCategories: SubCategory[];
}

export const getCategoryBySlug = async (slug: string) =>
  api<CategoryWithDetails>(`/category/slug/${slug}`);
