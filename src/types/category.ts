export interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  subcategoryTypes: SubcategoryType[];
}

export interface SubcategoryType {
  id: number;
  name: string;
  slug: string;
  fields: Field[];
}

export interface Field {
  id: number;
  name: string;
}
