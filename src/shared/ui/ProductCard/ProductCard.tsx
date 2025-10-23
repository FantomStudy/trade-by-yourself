import Image from "next/image";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  imageUrl: string;
  meta: string;
  price: string;
  title: string;
}

export const ProductCard = ({
  imageUrl,
  title,
  meta,
  price,
}: ProductCardProps) => {
  return (
    <div className={styles.card}>
      <Image
        alt={title}
        className={styles.image}
        height={250}
        src={imageUrl}
        width={300}
      />
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <p className={styles.meta}>{meta}</p>
        <p className={styles.price}>{price} ₽</p>
      </div>
    </div>
  );
};
