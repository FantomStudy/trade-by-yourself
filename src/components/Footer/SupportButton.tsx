"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui";
import styles from "./Footer.module.css";

const SUPPORT_PHONE = "+7 (800) 555-35-35";

export const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(setIsOpen, 5000, false);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSupportClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.supportWrapper}>
      <Button variant="success" className={styles.supportButton} onClick={handleSupportClick}>
        Тех поддержка
      </Button>
      {isOpen && <div className={styles.supportBadge}>{SUPPORT_PHONE}</div>}
    </div>
  );
};
