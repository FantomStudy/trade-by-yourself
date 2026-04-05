"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import styles from "./Footer.module.css";

const SUPPORT_PHONE = "+7 (800) 555-35-35";

export const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  // TODO: replace with useCurrentUser
  const user = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(setIsOpen, 5000, false);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSupportClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <footer className={styles.footer}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Logo />
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
              <Button variant="success">
                <Link href="/profile/messages/support">Тех поддержка</Link>
              </Button>
            ) : (
              <div className={styles.supportWrapper}>
                <Button
                  variant="success"
                  className={styles.supportButton}
                  onClick={handleSupportClick}
                >
                  Тех поддержка
                </Button>
                {isOpen && <div className={styles.supportBadge}>{SUPPORT_PHONE}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className={styles.copyright}>&copy; ТоргуйСам - сайт объявлений 2026</p>
    </footer>
  );
};
