import { Button } from "@/shared/ui";

import { UserInfo } from "../UserInfo/UserInfo";

import styles from "./SellerCard.module.css";

export const SellerCard = () => {
  return (
    <div className={styles.card}>
      <UserInfo rating={4.7} userName="Николай Петров" reviewsCount={245} />

      <div className={styles.buttons}>
        <Button color="green">Написать продавцу</Button>
        <Button>Показать номер</Button>
      </div>
    </div>
  );
};
