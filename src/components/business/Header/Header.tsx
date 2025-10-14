import { Button, Logo } from "@/components/ui";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerWrapper}>
          <Logo className={styles.logo} />
          <div className={styles.actions}>
            <Button className={styles.link}>Вход / Регистрация</Button>
            <Button color="green">Разместить объявление</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
