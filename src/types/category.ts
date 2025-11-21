export interface Category {
  id: number;
  name: string;
  subCategories: Array<SubCategories>;
}

interface SubCategories {
  id: number;
  name: string;
  subcategoryTypes: Array<SubCategoryType>;
}

interface SubCategoryType {
  id: number;
  name: string;
  fields: Array<{ id: number; name: string }>;
}
