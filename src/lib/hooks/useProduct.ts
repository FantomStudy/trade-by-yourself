import type { ExtendedProduct } from "@/types";

import { useEffect, useState } from "react";

import { getProductById } from "@/api/requests";

export const useProduct = (productId: number) => {
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError("Не удалось загрузить товар");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return { product, isLoading, error };
};
