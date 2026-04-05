import type { ProductFilters } from "@/api/products/getProducts";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products/getProducts";

export const useProducts = (query?: ProductFilters) =>
  useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
