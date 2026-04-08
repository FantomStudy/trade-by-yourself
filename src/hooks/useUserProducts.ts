import { useQuery } from "@tanstack/react-query";
import { getUserProducts } from "@/api/products";

export const useUserProducts = (userId: number) =>
  useQuery({
    queryKey: ["products", "user", userId],
    queryFn: () => getUserProducts(userId),
  });
