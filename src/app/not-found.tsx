import Link from "next/link";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <span className={styles.code}>404</span>
      <Typography variant="h1" className={styles.title}>
        Страница не найдена
      </Typography>
      <Typography className={styles.description}>
        К сожалению, запрашиваемая страница не существует или была удалена
      </Typography>

      <div className={styles.actions}>
        <Button render={<Link href="/" />} nativeButton={false}>
          На главную
        </Button>
        <Button
          variant="outline"
          render={<Link href="/profile/my-products" />}
          nativeButton={false}
        >
          Мои объявления
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
