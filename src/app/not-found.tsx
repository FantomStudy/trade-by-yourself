import Link from "next/link";
import { Button, Typography } from "@/components/ui";
import styles from "./not-found.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>

        <Typography variant="h1" className={styles.title}>
          Страница не найдена
        </Typography>

        <Typography variant="p" className={styles.description}>
          К сожалению, запрашиваемая страница не существует или была удалена
        </Typography>

        <div className={styles.actions}>
          <Button nativeButton={false} render={<Link href="/" />}>
            На главную
          </Button>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/profile/my-products" />}
          >
            Мои объявления
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
