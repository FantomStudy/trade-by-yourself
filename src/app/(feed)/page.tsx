"use client";
import type { Product } from "@/types/product";

import { useState } from "react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { ProductCard } from "@/components/product-card";

import { HeroBanner, Search } from "./_components";

import styles from "./page.module.css";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <>
      <HeroBanner />
      <div className="global-container">
        <Search setProducts={setProducts} />
        <div className={styles.grid}>
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className={styles.categoryCard}>
              <header className={styles.productHeader}>Категория</header>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <FeedWrapper products={products} />
      </div>
    </>
  );
};

export default HomePage;
