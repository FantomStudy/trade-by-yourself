"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { YANDEX_OAUTH_STATE_KEY } from "@/lib/auth/yandex-oauth";

import styles from "./screens/screens.module.css";

export const YandexLoginButton = () => {
  const onLogin = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        toast.error("NEXT_PUBLIC_API_URL не задан");
        return;
      }

      const state = crypto.randomUUID();
      localStorage.setItem(YANDEX_OAUTH_STATE_KEY, state);

      const response = await fetch(`${API_URL}/auth/yandex/url?state=${encodeURIComponent(state)}`, {
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Не удалось получить ссылку Яндекс");
        return;
      }

      const { url } = (await response.json()) as { url?: string };
      if (!url) {
        toast.error("Не удалось получить ссылку Яндекс");
        return;
      }

      window.location.href = url;
    } catch {
      toast.error("Ошибка входа через Яндекс");
    }
  };

  return (
    <div className={styles.oauth}>
      <Button
        className={styles.oauthButton}
        type="button"
        variant="outline"
        onClick={() => void onLogin()}
        style={{ background: "#FFCC00", color: "#000", borderColor: "#FFCC00", fontWeight: 600 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
          <circle cx="12" cy="12" r="12" fill="#FC3F1D"/>
          <path d="M13.5 7H11.8C10.4 7 9.5 7.8 9.5 9.1C9.5 10.4 10.2 11 11.3 11.7L12.1 12.2L9.4 17H7.5L10 12.6C8.7 11.7 7.8 10.7 7.8 9C7.8 7 9.2 5.5 11.8 5.5H15.3V17H13.5V7Z" fill="white"/>
        </svg>
        Войти через Яндекс
      </Button>
    </div>
  );
};
