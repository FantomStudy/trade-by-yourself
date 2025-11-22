import Link from "next/link";

import { Button, Logo } from "@/components/ui";

import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <Link href="/">
            <Logo />
          </Link>

          <div className={styles.actions}>
            <Button variant="ghost">Вход / Регистрация</Button>
            <Button variant="primary-green">Разместить объявление</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
