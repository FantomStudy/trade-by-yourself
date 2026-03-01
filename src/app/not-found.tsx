import Link from "next/link";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";
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
          <Button asChild>
            <Link href="/">На главную</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/profile/my-products">Мои объявления</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
