import { useQuery } from "@tanstack/react-query";

import { getCategoryBySlug } from "@/api/requests";

export const useCategoryBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["category", "slug", slug],
    queryFn: () => getCategoryBySlug(slug!),
    enabled: !!slug,
  });
};
