"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserProducts } from "@/api/requests";
import { ProductCard } from "@/components/product-card";
import { Typography } from "@/components/ui";

import styles from "./seller-product-feed.module.css";

interface SellerProductFeedProps {
  sellerId: number;
}

export const SellerProductFeed = ({ sellerId }: SellerProductFeedProps) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ["seller-products", sellerId],
    queryFn: () => getCurrentUserProducts(sellerId),
  });

  if (isError)
    return (
      <div className={styles.error}>
        <Typography>Не удалось загрузить объявления продавца</Typography>
      </div>
    );

  if (isPending)
    return (
      <div className={styles.loading}>
        <Typography>Загрузка...</Typography>
      </div>
    );

  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <Typography variant="h2">У продавца пока нет активных объявлений</Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Typography className={styles.title} variant="h1">
        Всего объявлений: {data.length}
      </Typography>
      <div className={styles.grid}>
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
