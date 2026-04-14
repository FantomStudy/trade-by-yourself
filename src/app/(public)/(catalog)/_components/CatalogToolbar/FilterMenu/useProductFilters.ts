import type { GetProductFiltersParams } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { getProductFilters } from "@/api/products";

export const useProductFilters = (params: GetProductFiltersParams) =>
  useQuery({
    queryKey: ["productFilters", params.categorySlug, params.subCategorySlug, params.typeSlug],
    queryFn: async () => getProductFilters(params),
  });
