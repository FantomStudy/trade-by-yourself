import Link from "next/link";

import { Button, Logo, Typography } from "@/components/ui";

import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>
          <Logo />

          <nav className={styles.nav}>
            <Link href="/">Разместить объявление</Link>
            <Link href="/">Правила</Link>
            <Link href="/">Политика конфиденциальности</Link>
            <Button variant="primary-green">Тех поддержка</Button>
          </nav>
        </div>

        <Typography className={styles.copyright}>
          ©ТоргуйСам - сайт объявлений 2025
        </Typography>
      </div>
    </footer>
  );
};
