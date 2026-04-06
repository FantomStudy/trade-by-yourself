export interface Category {
  id: number;
  name: string;
  subCategories: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  subcategoryTypes: SubcategoryType[];
}

export interface SubcategoryType {
  id: number;
  name: string;
  fields: Field[];
}

export interface Field {
  id: number;
  name: string;
}
