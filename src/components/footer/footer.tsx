"use client";

import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import { SupportHelpModal } from "@/components/support-help-modal";

import styles from "./footer.module.css";

export const Footer = () => {
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  return (
    <footer className={styles.footer}>
      <div className="global-container">
        <div className={styles.wrapper}>
          <Logo />
          <nav className={styles.nav}>
            <Link href="/">Разместить объявление</Link>
            <Link href="/terms">Пользовательское соглашение</Link>
            <Link href="/oferta">Публичная оферта</Link>
            <Link href="/privacy">Политика конфиденциальности</Link>
            <Link href="/cookies">Политика cookies</Link>
            <Link href="/consent">Согласие на обработку ПДн</Link>
            <Button variant="success" onClick={() => setSupportModalOpen(true)}>
              Тех поддержка
            </Button>
          </nav>
        </div>
      </div>
      <SupportHelpModal open={supportModalOpen} onOpenChange={setSupportModalOpen} />
      <p className={styles.copyright}>©ТоргуйСам - сайт объявлений 2026</p>
    </footer>
  );
};
