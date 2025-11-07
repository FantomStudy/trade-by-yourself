"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/types";

import { ProductCard } from "@/features/products";
import { getMyProducts } from "@/lib/api";

import styles from "./page.module.css";

const MyListingsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getMyProducts();
        setProducts(data);
      } catch (err) {
        setError("Не удалось загрузить объявления");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className={styles.message}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.message}>{error}</div>;
  }

  if (products.length === 0) {
    return <div className={styles.message}>У вас пока нет объявлений</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои объявления</h1>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MyListingsPage;
