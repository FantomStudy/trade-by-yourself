import type { ProductFilters } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";

export const useProducts = (query?: ProductFilters) =>
  useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
