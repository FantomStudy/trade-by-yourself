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
      <Image
        alt={product.name}
        className={styles.image}
        height={300}
        src={product.images[0]}
        width={300}
      />
      <div className={styles.info}>
        <p>{product.name}</p>
        <div className={styles.meta}>
          <p>{product.address}</p>
          <p>{product.createdAt}</p>
        </div>
        <p className={styles.price}>{product.price} ₽</p>
      </div>
      <Link href={`/products/${product.id}`} className={styles.link} />
    </div>
  );
};
