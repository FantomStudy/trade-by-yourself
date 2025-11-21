import Link from "next/link";

import { Button, Logo } from "@/components/ui";

import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Logo />
          <nav className={styles.nav}>
            <Link href="/">Разместить объявление</Link>
            <Link href="/">Правила</Link>
            <Link href="/">Политика конфиденциальности</Link>
            <Button variant="secondary">Тех поддержка</Button>
          </nav>
        </div>
      </div>
      <p className={styles.copyright}>©ТоргуйСам - сайт объявлений 2025</p>
    </footer>
  );
};
