import Link from "next/link";

import { Button, Logo } from "@/components/ui";

import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.main}>
          <Logo />
          <nav className={styles.nav}>
            <Link href="/">Разместить объявление</Link>
            <Link href="/">Правила</Link>
            <Link href="/">Политика конфиденциальности</Link>
            <Button color="green">Тех поддержка</Button>
          </nav>
        </div>
      </div>
      <p className={styles.secondary}>©ТоргуйСам - сайт объявлений 2025</p>
    </footer>
  );
};
