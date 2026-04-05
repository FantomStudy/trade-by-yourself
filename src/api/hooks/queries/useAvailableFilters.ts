import { useQuery } from "@tanstack/react-query";

import { getAvailableFilters } from "@/api/requests";

interface AvailableFiltersParams {
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
}

export const useAvailableFilters = (params: AvailableFiltersParams) => {
  return useQuery({
    queryKey: ["availableFilters", params],
    queryFn: () => getAvailableFilters(params),
    enabled: !!params.categorySlug,
  });
};
