import type { Product } from "@/types";
import clsx from "clsx";
import { ProductCard } from "../product-card";
import styles from "./feed-wrapper.module.css";

interface FeedWrapperProps {
  className?: string;
  products: Product[];
}

export const FeedWrapper = ({ products, className }: FeedWrapperProps) => {
  return (
    <div className={clsx(styles.grid, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
