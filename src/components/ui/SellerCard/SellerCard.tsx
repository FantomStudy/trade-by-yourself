import { UserInfo } from "../UserInfo/UserInfo";
import styles from "./SellerCard.module.css";
import { Button } from "@/components/ui";

export const SellerCard = () => {
  return (
    <div className={styles.card}>
      <UserInfo userName="Николай Петров" rating={4.7} reviewsCount={245} />

      <div className={styles.buttons}>
        <Button color="green">Написать продавцу</Button>
        <Button>Показать номер</Button>
      </div>
    </div>
  );
};
