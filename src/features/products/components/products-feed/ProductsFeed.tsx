import { getAllProducts } from "@/lib/api";

import { ProductCard } from "../product-card/ProductCard";

import styles from "./ProductsFeed.module.css";

export const ProductsFeed = async () => {
  const products = await getAllProducts();

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
