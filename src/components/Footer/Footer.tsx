import Link from "next/link";
import { getCurrentUser } from "@/api/auth";
import { Button, Logo } from "../ui";
import { SupportButton } from "./SupportButton";
import styles from "./Footer.module.css";

export const Footer = async () => {
  const user = await getCurrentUser().catch(() => null);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>
          <Link href="/">
            <Logo />
          </Link>
          <div className={styles.column}>
            <nav className={styles.nav}>
              <Link href="/">Разместить объявление</Link>
              <Link href="/terms">Пользовательское соглашение</Link>
              <Link href="/oferta">Публичная оферта</Link>
              <Link href="/privacy">Политика конфиденциальности</Link>
              <Link href="/cookies">Политика cookies</Link>
              <Link href="/consent">Согласие на обработку ПДн</Link>
            </nav>
            {user ? (
              <Button
                variant="success"
                render={<Link href="/profile/messages/support" />}
                nativeButton={false}
              >
                Тех поддержка
              </Button>
            ) : (
              <SupportButton />
            )}
          </div>
        </div>
      </div>
      <p className={styles.copyright}>&copy; ТоргуйСам - сайт объявлений 2026</p>
    </footer>
  );
};
