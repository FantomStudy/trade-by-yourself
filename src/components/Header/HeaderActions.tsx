"use client";

import type { Route } from "next";
import { HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/api/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AuthDialog } from "../auth-dialog";
import { Avatar, Button } from "../ui";
import styles from "./Header.module.css";

const GuestActions = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const openAuthDialog = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("auth")) {
      setIsAuthOpen(true);
    }
    router.push(pathname as Route);
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
        <MessageSquareIcon color="var(--primary)" />
      </Link>

      <Link href="/profile/favorites">
        <HeartIcon color="var(--pink)" />
      </Link>

      <Link href="/profile/my-products">
        <Avatar src={user.data.photo} fallback={user.data.fullName[0]} />
      </Link>

      <Button variant="success">
        <Link href="/profile/create-product">Разместить объявление</Link>
      </Button>

      <Button variant="ghost" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
};
