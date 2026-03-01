"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui-lab/Button";
import { Logo } from "@/components/ui-lab/Logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import styles from "./Footer.module.css";

const SUPPORT_PHONE = "+7 (800) 555-35-35";

export const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = useCurrentUser();

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => setIsOpen(false), 5000);

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
          <div className={styles.content}>
            <nav className={styles.nav}>
              <Link href="/terms">Пользовательское соглашение</Link>
              <Link href="/oferta">Публичная оферта</Link>
              <Link href="/privacy">Политика конфиденциальности</Link>
              <Link href="/cookies">Политика cookies</Link>
              <Link href="/consent">Согласие на обработку ПДн</Link>
            </nav>
            {user.data ? (
              <Button variant="success" asChild>
                <Link href="/profile/messages/support">Тех поддержка</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  className={styles.supportButton}
                  onClick={handleSupportClick}
                >
                  Тех поддержка
                </Button>

                {isOpen && (
                  <div className={styles.supportBadge}>{SUPPORT_PHONE}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <p className={styles.copyright}>
        &copy; ТоргуйСам - сайт объявлений 2026
      </p>
    </footer>
  );
};
