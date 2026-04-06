import { api } from "../../instance";

interface FieldFilterValue {
  fieldId: number;
  fieldName: string;
  isRequired: boolean;
  values: string[];
}

interface AvailableFiltersResponse {
  fields: FieldFilterValue[];
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

interface AvailableFiltersParams {
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
}

export const getAvailableFilters = async (params: AvailableFiltersParams) =>
  api<AvailableFiltersResponse>("/product/available-filters", {
    query: params,
  });
