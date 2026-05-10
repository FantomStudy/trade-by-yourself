import clsx from "clsx";
import { HeartIcon } from "lucide-react";
import { getFavorites } from "@/api/products/favorites";
import { LikeButton } from "@/app/(public)/(catalog)/_components/FeedList/LikeButton";
import { ProductCard } from "@/app/(public)/(catalog)/_components/FeedList/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import styles from "./Favorites.module.css";

export const Favorites = async () => {
  const products = await getFavorites();

  if (!products) {
    return (
      <div className={styles.stateContainer}>
        <div className={clsx(styles.iconContainer, styles.iconContainerError)}>
          <HeartIcon className={clsx(styles.icon, styles.iconError)} />
        </div>
        <h3 className={styles.title}>Ошибка загрузки</h3>
        <p className={styles.description}>Не удалось загрузить избранные товары</p>
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
