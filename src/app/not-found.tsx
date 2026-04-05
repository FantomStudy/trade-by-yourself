import Link from "next/link";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>

        <Typography className={styles.title} variant="h1">
          Страница не найдена
        </Typography>

        <Typography className={styles.description} variant="p">
          К сожалению, запрашиваемая страница не существует или была удалена
        </Typography>

        <div className={styles.actions}>
          <Button nativeButton={false} render={<Link href="/">На главную</Link>} />

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
