import Image from "next/image";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  meta: string;
  price: string;
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
        src={imageUrl}
        alt={title}
        width={300}
        height={250}
        className={styles.image}
      />
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <p className={styles.meta}>{meta}</p>
        <p className={styles.price}>{price} ₽</p>
      </div>
    </div>
  );
};
