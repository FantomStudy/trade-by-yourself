import Image from "next/image";
import styles from "./GoodCard.module.css";

interface GoodCardProps {
  imageUrl: string;
  title: string;
  meta: string;
  price: string;
}

export const GoodCard = ({ imageUrl, title, meta, price }: GoodCardProps) => {
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
