import type { Product } from "@/types/product";

import { createContext, use, useMemo } from "react";

interface ProductCardContextType {
  product: Product;
}

const ProductCardContext = createContext<ProductCardContextType | undefined>(
  undefined,
);

interface ProductCardProviderProps {
  children: React.ReactNode;
  product: Product;
}

export const ProductCardProvider = ({
  children,
  product,
}: ProductCardProviderProps) => {
  const value = useMemo(() => ({ product }), [product]);

  return <ProductCardContext value={value}>{children}</ProductCardContext>;
};

export const useProductCard = () => {
  const context = use(ProductCardContext);
  if (!context) {
    throw new Error("useProductCard must be used within a ProductCardProvider");
  }

  return context;
};
