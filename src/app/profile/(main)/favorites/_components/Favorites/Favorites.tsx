import clsx from "clsx";
import { HeartIcon } from "lucide-react";
import { getFavorites } from "@/api/products/favorites";
import { LikeButton } from "@/components/LikeButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import styles from "./Favorites.module.css";

export const Favorites = async () => {
  let products;
  try {
    products = await getFavorites();
  } catch {
    products = null;
  }

  if (!products) {
    return (
      <div className={styles.stateContainer}>
        <div className={clsx(styles.iconContainer, styles.iconContainerEmpty)}>
          <HeartIcon className={clsx(styles.icon, styles.iconEmpty)} />
        </div>
        <h3 className={styles.title}>Избранное пусто</h3>
        <p className={styles.description}>
          Здесь будут отображаться товары, которые вы добавите в избранное
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.stateContainer}>
        <div className={clsx(styles.iconContainer, styles.iconContainerEmpty)}>
          <HeartIcon className={clsx(styles.icon, styles.iconEmpty)} />
        </div>
        <h3 className={styles.title}>Избранное пусто</h3>
        <p className={styles.description}>
          Здесь будут отображаться товары, которые вы добавите в избранное
        </p>
      </div>
    );
  }

  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          action={<LikeButton initLiked={product.isFavorited} productId={product.id} />}
        />
      ))}
    </ProductGrid>
  );
};
