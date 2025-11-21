import type { Product } from "@/types";

import Link from "next/link";

import { Typography } from "@/components/ui";
import { formatPrice } from "@/lib/format";

import { LikeButton } from "../like-button";
import { ProductPreview } from "./product-preview/product-preview";

import styles from "./product-card.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className={styles.card}>
      <Link href={`/product/${product.id}`}>
        <ProductPreview images={product.images} />
      </Link>

      <div className={styles.info}>
        <LikeButton
          className={styles.likeButton}
          initLiked={product.isFavorited}
          productId={product.id}
        />

        <Link href={`/product/${product.id}`}>
          <Typography className={styles.name}>{product.name}</Typography>
        </Link>

        <div className={styles.meta}>
          <Typography>{product.address}</Typography>
          <Typography>{product.createdAt}</Typography>
        </div>

        <Typography className={styles.price}>
          {formatPrice(product.price)}
        </Typography>
      </div>
    </article>
  );
};
