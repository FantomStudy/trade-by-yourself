import type { Product } from "@/types";

import { cn } from "@/lib/utils";

import { ProductCard } from "../product-card";

import styles from "./feed-wrapper.module.css";

interface FeedWrapperProps {
  className?: string;
  products: Product[];
}

export const FeedWrapper = ({ products, className }: FeedWrapperProps) => {
  return (
    <div className={cn(styles.grid, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
