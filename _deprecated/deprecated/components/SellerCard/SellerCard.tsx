import { Button, UserInfo } from "@/components/ui";

import styles from "./SellerCard.module.css";

export const SellerCard = () => {
  return (
    <div className={styles.card}>
      <UserInfo fullName="Николай Петров" profileType="Физ лицо" />

      <div className={styles.buttons}>
        <Button color="green">Написать продавцу</Button>
        <Button>Показать номер</Button>
      </div>
    </div>
  );
};
