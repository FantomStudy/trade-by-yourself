export interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  subcategoryTypes: SubcategoryType[];
}

interface SubcategoryType {
  id: number;
  name: string;
  slug: string;
  fields: Field[];
}

interface Field {
  id: number;
  name: string;
}
