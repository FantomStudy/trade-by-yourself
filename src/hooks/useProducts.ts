import type { ProductsFilters } from "@/api-lab/products/getProducts";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api-lab/products/getProducts";

export const useProducts = (filters?: ProductsFilters) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: async () => getProducts(filters),
  });
