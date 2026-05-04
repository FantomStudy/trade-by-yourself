"use client";

import { toast } from "sonner";

import { getVkOAuthUrl } from "@/api/requests";
import { Button } from "@/components/ui";
import { VK_OAUTH_STATE_KEY } from "@/lib/auth/vk-oauth";

import styles from "./screens/screens.module.css";

/** Редирект на VK: бэк отдаёт url, после callback — POST /auth/vk/sign-in (см. app/auth/vk/callback) */
export const VkLoginButton = () => {
  const onLogin = async () => {
    try {
      const state = crypto.randomUUID();
      localStorage.setItem(VK_OAUTH_STATE_KEY, state);
      const data = await getVkOAuthUrl(state);
      if (!data?.url) {
        toast.error("Не удалось получить ссылку VK");
        return;
      }
      window.location.assign(data.url);
    } catch {
      toast.error("Ошибка входа через VK");
    }
  };

  return (
    <div className={styles.oauth}>
      <span className={styles.oauthLabel}>или</span>
      <Button className={styles.oauthButton} type="button" variant="secondary" onClick={() => void onLogin()}>
        Войти через VK
      </Button>
    </div>
  );
};
