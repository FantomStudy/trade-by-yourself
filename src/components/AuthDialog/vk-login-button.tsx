"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui";
import { VK_OAUTH_STATE_KEY } from "@/lib/auth/vk-oauth";

import styles from "./screens/screens.module.css";

export const VkLoginButton = () => {
  const onLogin = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        toast.error("NEXT_PUBLIC_API_URL не задан");
        return;
      }

      const state = crypto.randomUUID();
      localStorage.setItem(VK_OAUTH_STATE_KEY, state);

      const response = await fetch(`${API_URL}/auth/vk/url?state=${encodeURIComponent(state)}`, {
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Не удалось получить ссылку VK");
        return;
      }

      const { url } = (await response.json()) as { url?: string };
      if (!url) {
        toast.error("Не удалось получить ссылку VK");
        return;
      }

      window.location.href = url;
    } catch {
      toast.error("Ошибка входа через VK");
    }
  };

  return (
    <div className={styles.oauth}>
      <span className={styles.oauthLabel}>или</span>
      <Button
        className={styles.oauthButton}
        type="button"
        variant="secondary"
        onClick={() => void onLogin()}
      >
        Войти через VK
      </Button>
    </div>
  );
};
