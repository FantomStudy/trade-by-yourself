import type { Product } from "@/types";

import { cn } from "@/lib/utils";

import { ProductCard } from "./product-card";

interface ProductFeedProps {
  className?: string;
  products: Product[];
}

export const ProductFeed = ({ products, className }: ProductFeedProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
