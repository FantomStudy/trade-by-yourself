"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { TID_OAUTH_STATE_KEY } from "@/lib/auth/tid-oauth";

import styles from "./screens/screens.module.css";

export const TIDLoginButton = () => {
  const onLogin = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        toast.error("NEXT_PUBLIC_API_URL не задан");
        return;
      }

      const state = crypto.randomUUID();
      localStorage.setItem(TID_OAUTH_STATE_KEY, state);

      const response = await fetch(`${API_URL}/auth/t-id/url?state=${encodeURIComponent(state)}`, {
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Не удалось получить ссылку T-ID");
        return;
      }

      const { url } = (await response.json()) as { url?: string };
      if (!url) {
        toast.error("Не удалось получить ссылку T-ID");
        return;
      }

      window.location.href = url;
    } catch {
      toast.error("Ошибка входа через T-ID");
    }
  };

  return (
    <div className={styles.oauth}>
      <Button
        className={styles.oauthButton}
        type="button"
        variant="success"
        onClick={() => void onLogin()}
      >
        Войти через T-ID
      </Button>
    </div>
  );
};
