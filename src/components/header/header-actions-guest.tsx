"use client";

import { useEffect } from "react";
import { useAuthDialog } from "@/components/AuthDialog";
import { Button } from "@/components/ui/Button";

import styles from "./header.module.css";

export const HeaderActionsGuest = () => {
  const { open } = useAuthDialog();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "1") {
      open();
      params.delete("auth");
      const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", url);
    }
  }, []);

  return (
    <div className={styles.actions}>
      <Button variant="ghost" onClick={open}>
        Вход / Регистрация
      </Button>

      <Button variant="success" onClick={open}>
        Разместить объявление
      </Button>
    </div>
  );
};
