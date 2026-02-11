"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, Logo } from "@/components/ui";
import { useAuth } from "@/lib/contexts";

import styles from "./footer.module.css";

const SUPPORT_PHONE = "+7 (800) 555-35-35";

export const Footer = () => {
  const { user } = useAuth();
  const [showPhone, setShowPhone] = useState(false);

  const handleSupportClick = () => {
    if (!user) {
      setShowPhone(true);
      // Скрываем номер через 5 секунд
      setTimeout(() => setShowPhone(false), 5000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Logo />
          <nav className={styles.nav}>
            <Link href="/">Разместить объявление</Link>
            <Link href="/">Правила</Link>
            <Link href="/">Политика конфиденциальности</Link>
            {user ? (
              <Link href="/profile/messages/support">
                <Button variant="secondary">Тех поддержка</Button>
              </Link>
            ) : (
              <div style={{ position: "relative" }}>
                <Button variant="secondary" onClick={handleSupportClick}>
                  Тех поддержка
                </Button>
                {showPhone && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--color-primary)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      fontWeight: "500",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {SUPPORT_PHONE}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
      <p className={styles.copyright}>©ТоргуйСам - сайт объявлений 2025</p>
    </footer>
  );
};
