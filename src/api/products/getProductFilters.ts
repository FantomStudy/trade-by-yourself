import { api } from "../instance";

export interface GetProductFiltersParams {
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
}

interface AvailableFilters {
  fields: Field[];
  priceRange: {
    min: number;
    max: number;
  };
  states: Array<"NEW" | "USED">;
  profileTypes: Array<"INDIVIDUAL" | "OOO" | "IP">;
  ratingRange?: {
    min: number;
    max: number;
  };
}

interface Field {
  fieldId: number;
  fieldName: string;
  isRequired: boolean;
  values: string[];
}

export const getProductFilters = (query: GetProductFiltersParams) =>
  api<AvailableFilters>("/product/available-filters", { query });
