import { Avatar } from "@/components/ui/Avatar/Avatar";
import styles from "./SellerCard.module.css";
import { Button, StarIcon } from "@/components/ui";

export const SellerCard = () => {
  return (
    <div className={styles.card}>
      <Avatar size={112} />
      <p className={styles.name}>Николай Петров</p>
      <div className={styles.stats}>
        <span className={styles.rating}>
          <StarIcon /> 4.5
        </span>

        <span>245 отзывов</span>
      </div>
      <div>Юридическое лицо</div>
      <Button color="green">Написать продавцу</Button>
      <Button>Показать номер</Button>
    </div>
  );
};
