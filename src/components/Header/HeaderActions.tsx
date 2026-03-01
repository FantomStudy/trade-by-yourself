"use client";

import { HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/api-lab/auth/logout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AuthDialog } from "../auth-dialog";
import { Avatar } from "../ui-lab/Avatar";
import { Button } from "../ui-lab/Button";
import styles from "./Header.module.css";

const GuestActions = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthDialog = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "1") {
      setIsAuthOpen(true);
      params.delete("auth");
      const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", url);
    }
  }, []);

  return (
    <div className={styles.actions}>
      <Button variant="ghost" onClick={openAuthDialog}>
        Вход / Регистрация
      </Button>

      <Button variant="success" onClick={openAuthDialog}>
        Разместить объявление
      </Button>

      <AuthDialog onOpenChange={setIsAuthOpen} open={isAuthOpen} />
    </div>
  );
};

export const HeaderActions = () => {
  const user = useCurrentUser();

  if (!user.data) return <GuestActions />;

  return (
    <div className={styles.actions}>
      <Link href="/profile/messages">
        <MessageSquareIcon className="text-secondary" />
      </Link>

      <Link href="/profile/favorites">
        <HeartIcon className="text-pink" />
      </Link>

      <Link href="/profile/my-products">
        <Avatar fullName={user.data.fullName} />
      </Link>

      <Button asChild variant="success">
        <Link href="/profile/create-product">Разместить объявление</Link>
      </Button>

      <Button variant="ghost" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
};
