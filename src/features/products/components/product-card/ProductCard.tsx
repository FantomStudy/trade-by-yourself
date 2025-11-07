import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          fill
          alt={product.name}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={product.images[0]}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{product.price} ₽</p>
        <div className={styles.meta}>
          <p>{product.address}</p>
          <p>{product.createdAt}</p>
        </div>
      </div>
      <Link href={`/product/${product.id}`} className={styles.link} />
    </div>
  );
};
